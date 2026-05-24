from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.models.user_model import User
from app.models.post_model import Post

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.get("")
async def list_posts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.is_published == True).order_by(Post.created_at.desc()))
    posts = result.scalars().all()
    return [
        {
            "id": str(p.id), "title": p.title, "content": p.content,
            "author_id": str(p.author_id), "tags": p.tags,
            "image_url": p.image_url, "like_count": p.like_count,
            "created_at": p.created_at.isoformat()
        }
        for p in posts
    ]


@router.post("")
async def create_post(
    title: str, content: str, tags: str = None, image_url: str = None,
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    post = Post(title=title, content=content, tags=tags, image_url=image_url, author_id=current_user.id)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return {"id": str(post.id), "message": "Post created successfully"}


@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if str(post.author_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    await db.delete(post)
    await db.commit()
    return {"message": "Post deleted successfully"}
