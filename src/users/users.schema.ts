import mongoose, { Document } from 'mongoose';

const SavedArticleSchema = new mongoose.Schema({
  title: { type: String },
  urlToImage: { type: String },
  notes: { type: String },
  url: { type: String },
});

export interface SavedArticleDocument extends mongoose.Document {
  title: string;
  urlToImage: string;
  url?: string;
  notes?: string;
}

export const SavedArticleModel = mongoose.model<SavedArticleDocument>(
  'SavedArticle',
  SavedArticleSchema,
);

//----------------------------------------------------------------

export interface User extends Document {
  id?: string;
  username: string;
  password: string;
  email: string;
  savedArticles?: SavedArticleDocument[];
}

export const UserSchema = new mongoose.Schema<User>({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  savedArticles: [{ type: SavedArticleSchema }],
});
