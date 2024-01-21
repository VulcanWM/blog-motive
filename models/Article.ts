import mongoose from 'mongoose'

const AlbumSchema = new mongoose.Schema({
  userId: String,
  articleId: String,
  deadline: Object,
})

export default mongoose.models.Album || mongoose.model('Album', AlbumSchema);