import UserModel from '../models/User.js'
import PostModel from '../models/Post.js'; 

export const create = async (req, res) => {
    try{
        const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: tags,
            user: req.userId,
        })

        const post = await doc.save();

        res.json(post)

    }catch(err){
        console.log(err)
        res.status(500).json({message: 'Не удалось создать пост'})
    }
}

export const remove = async (req, res) => {
    try{
        const postId = req.params.id 

        const doc = await PostModel.findOneAndDelete({ _id: postId})

        if (!doc) {
            return res.status(404).json({
              message: 'Статья не найдена',
            });
          }
      
          res.json({
            success: true,
          });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: 'Не удалось удалить пост'})
    }
}

export const getAll = async(req, res) => {
    try{
        const posts = await PostModel.find()
             .populate('user')
             .sort({createdAt: -1})
             .exec();
            
        res.json(posts)
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'Не удалось получить посты'})
    }
}



export const getOne = async(req, res) => {
    try{
        const postId = req.params.id
        const userId = req.userId

        const post = await PostModel.findById(postId).populate('user');
        if (!post) {
          return res.status(404).json({ message: 'Пост не найден' });
        }
    
        if (userId) {
          const user = await UserModel.findById(userId);
          if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
          }
    
          if (!user.viewedPosts.includes(postId)) {
            user.viewedPosts.push(postId);
            await user.save();
            
            post.viewsCount += 1;
            await post.save();
          }
    } else {
      await post.save();
    }

    res.json(post);
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'Не удалось получить посты'})
    }
}