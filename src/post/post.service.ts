import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { JwtPayload } from 'src/auth/interfaces/auth.interface';
import { UserService } from 'src/user/user.service';
import { Like, Repository } from 'typeorm';
import { CreateCommentReq, FindCommentsReq } from './dto/comment.dto';
import { CreatePostReq, FindPostRes } from './dto/post.dto';
import { Category } from './entities/category.entity';
import { Comment } from './entities/comment.entity';
import { Post } from './entities/post.entity';
import { Subcategory } from './entities/subcategory.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,
		@InjectRepository(Comment)
		private readonly commentRepository: Repository<Comment>,
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
		@InjectRepository(Subcategory)
		private readonly subcategoryRepository: Repository<Subcategory>,
		@InjectRepository(Tag)
		private readonly tagRepository: Repository<Tag>,
		private readonly userService: UserService,
	) {}

	// 포스트
	async createPost(
		reqUser: JwtPayload,
		createPostReq: CreatePostReq,
	): Promise<Post> {
		try {
			const {
				title,
				content,
				excerpt,
				categoryId,
				subcategoryId,
				rawTags,
			} = createPostReq;

			const category = await this.categoryRepository.findOne({
				where: { id: categoryId },
			});
			if (!category) {
				throw new Error('해당 카테고리가 존재하지 않음');
			}

			const subcategory = await this.subcategoryRepository.findOne({
				where: { id: subcategoryId },
			});
			if (!subcategory) {
				throw new Error('해당 서브카테고리가 존재하지 않음');
			}

			let tags: Tag[] = [];
			for (const rawTag of rawTags) {
				if (rawTag.id === -1) {
					const tag = await this.tagRepository.find({
						where: { id: rawTag.id },
					})[0];
					tags.push(tag);
				} else {
					const tag = await this.tagRepository.find({
						where: { name: rawTag.name },
					})[0];
					tags.push(tag);
				}
			}

			const user = await this.userService.findUser(reqUser.id);
			if (!user) {
				throw new Error('해당 작성자가 존재하지 않음');
			}

			const post = this.postRepository.create({
				title,
				content,
				excerpt,
				category,
				subcategory,
				tags,
				user,
			});
			return await this.postRepository.save(post);
		} catch (error) {
			throw error;
		}
	}

	async findPosts() {
		// TODO: 무한 스크롤 + 커서 기반 페이징으로 수정
		const posts = await this.postRepository.find();
		return posts;
	}

	async findPost(id: number) {
		const posts = await this.postRepository.findBy({ id });
		const post = posts[0];
		return post;
	}

	// 카테고리
	async findCategories() {
		const categories = await this.categoryRepository.find();
		return categories;
	}

	// 태그
	async findTags(keyword: string) {
		// TODO: 속도가 느리다면 redis 이용하는 방식으로 수정
		const tags = await this.tagRepository
			.createQueryBuilder('tag')
			.where('MATCH(tag.name) AGAINST(:keyword IN BOOLEAN MODE)', {
				keyword: `${keyword}*`,
			})
			.take(5)
			.getMany();
		return tags;
	}

	async createComment(
		reqUser: JwtPayload,
		createCommentReq: CreateCommentReq,
	) {
		try {
			const { parentId, content, postId } = createCommentReq;

			const posts = await this.postRepository.findBy({ id: postId });
			const post = posts[0];
			const user = await this.userService.findUser(reqUser.id);
			const comment = this.commentRepository.create({
				parentId,
				content,
				post,
				user,
			});
			return await this.commentRepository.save(comment);
		} catch (error) {
			throw error;
		}
		return '';
	}

	async findComments(findCommentsReq: FindCommentsReq) {
		try {
			const { postId } = findCommentsReq;
			const comments = await this.commentRepository.findBy({
				post: { id: postId },
			});
			return comments;
		} catch (error) {
			throw error;
		}
	}
}
