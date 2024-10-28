import { User } from "../models/index.js";
import type { BookDocument } from "../models/Book.js";
import { signToken, AuthenticationError } from "../services/auth.js";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[];
  bookCount: number;
}

interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface saveBookArgs {
  input: {
    authors: string[];
    description: string;
    title: string;
    bookId: string;
    image: string;
    link: string;
  };
}

interface Context {
  user?: User;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs): Promise<{ token: string; user: User }> => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_parent: any, { input }: saveBookArgs, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        ).populate("savedBooks");
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    removeBook: async (_parent: any, { bookId }: { bookId: string}, context: Context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          {
            _id: context.user._id,
          },
          { $pull: { savedBooks: { bookId:  bookId} } },
          { new: true }
        ).populate("savedBooks");
        return updatedUser;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

export default resolvers;
