import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { endWith } from 'rxjs';
import { JwtPayload } from 'src/auth/interfaces/auth.interface';
import { UserService } from 'src/user/user.service';
import { In, LessThan, Repository } from 'typeorm';
import { CreateCommentReq } from './dto/comment.dto';
import {
	CreatePostReq,
	FindPopularPostMinRes,
	FindPostMinRes,
	FindPostRes,
} from './dto/post.dto';
import { Category } from './entities/category.entity';
import { Comment } from './entities/comment.entity';
import { LikeComment } from './entities/likeComment.entity';
import { LikePost } from './entities/likePost.entity';
import { PopularPost } from './entities/popularPost.entity';
import { Post } from './entities/post.entity';
import { SavedPost } from './entities/savedPost.entity';
import { Subcategory } from './entities/subcategory.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class PostService {
	constructor(
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,
		@InjectRepository(PopularPost)
		private readonly popularPostRepository: Repository<PopularPost>,
		@InjectRepository(SavedPost)
		private readonly savedPostRepository: Repository<SavedPost>,
		@InjectRepository(Comment)
		private readonly commentRepository: Repository<Comment>,
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>,
		@InjectRepository(Subcategory)
		private readonly subcategoryRepository: Repository<Subcategory>,
		@InjectRepository(Tag)
		private readonly tagRepository: Repository<Tag>,
		@InjectRepository(LikeComment)
		private readonly likeCommentRepository: Repository<LikeComment>,
		@InjectRepository(LikePost)
		private readonly likePostRepository: Repository<LikePost>,
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

	async findMyPosts(reqUser: JwtPayload) {
		try {
			// const posts = await this.postRepository.find({
			// 	order: {
			// 		createdAt: 'DESC',
			// 	},
			// 	take: 10,
			// 	skip: offset,
			// });
		} catch (error) {
			throw error;
		}
	}

	async findPostsLatest(offset: number = 0) {
		try {
			const posts = await this.postRepository.find({
				order: {
					createdAt: 'DESC',
				},
				take: 10,
				skip: offset,
			});
			if (posts.length === 0) {
				return;
			}
			const firstPostId = posts[0].id;
			const oneNextPageFirstPostId = firstPostId - 10;
			const twoNextPageFirstPostId = oneNextPageFirstPostId - 10;
			const threeNextPageFirstPostId = twoNextPageFirstPostId - 10;
			const fourtNextPageFirstPostId = threeNextPageFirstPostId - 10;
			const fiveNextPageFirstPostId = fourtNextPageFirstPostId - 10;

			const oneNextPageFirstPosts = await this.postRepository.findBy({
				id: oneNextPageFirstPostId,
			});
			const isOneNextPageExists = oneNextPageFirstPosts.length > 0;
			const twoNextPageFirstPosts = await this.postRepository.findBy({
				id: twoNextPageFirstPostId,
			});
			const isTwoNextPageExists = twoNextPageFirstPosts.length > 0;
			const threeNextPageFirstPosts = await this.postRepository.findBy({
				id: threeNextPageFirstPostId,
			});
			const isThreeNextPageExists = threeNextPageFirstPosts.length > 0;
			const fourtNextPageFirstPosts = await this.postRepository.findBy({
				id: fourtNextPageFirstPostId,
			});
			const isFourNextPageExists = fourtNextPageFirstPosts.length > 0;
			const fiveNextPageFirstPosts = await this.postRepository.findBy({
				id: fiveNextPageFirstPostId,
			});
			const isFiveNextPageExists = fiveNextPageFirstPosts.length > 0;

			const postsResult = plainToInstance(FindPostMinRes, posts);
			let result = {
				post: postsResult,
				['isOneNextPageExists']: isOneNextPageExists,
				['isTwoNextPageExists']: isTwoNextPageExists,
				['isThreeNextPageExists']: isThreeNextPageExists,
				['isFourNextPageExists']: isFourNextPageExists,
				['isFiveNextPageExists']: isFiveNextPageExists,
			};
			return result;
		} catch (error) {
			throw error;
		}
	}

	async findPostsLatestByCategory(
		offset: number = 0,
		categoryId: number,
		subcategoryId?: number,
	) {
		try {
			let whereConditions: any = {};

			whereConditions.categoryId = categoryId;
			if (subcategoryId) {
				whereConditions.subcategoryId = subcategoryId;
			}
			const [posts, totalCount] = await this.postRepository.findAndCount({
				where: whereConditions,
				order: {
					createdAt: 'DESC',
				},
				take: 10,
				skip: offset,
			});

			const postsResult = plainToInstance(FindPostMinRes, posts);
			let result = {
				post: postsResult,
				['isOneNextPageExists']: totalCount - (offset + 10) > 0,
				['isTwoNextPageExists']: totalCount - (offset + 20) > 0,
				['isThreeNextPageExists']: totalCount - (offset + 30) > 0,
				['isFourNextPageExists']: totalCount - (offset + 40) > 0,
				['isFiveNextPageExists']: totalCount - (offset + 50) > 0,
			};
			return result;
		} catch (error) {
			throw error;
		}
	}

	async findPostsPopular(offset: number = 0) {
		try {
			const posts = await this.popularPostRepository.find({
				order: {
					id: 'ASC',
				},
				relations: ['post'],
				take: 10,
				skip: offset,
			});

			return plainToInstance(FindPopularPostMinRes, posts);
		} catch (error) {
			throw error;
		}
	}

	async findPostsCategory(offset: number = 0, categoryId: number) {
		try {
			const posts = await this.postRepository.find({
				where: {
					category: { id: categoryId },
				},
				order: {
					id: 'ASC',
				},
				take: 10,
				skip: offset,
			});

			return plainToInstance(FindPopularPostMinRes, posts);
		} catch (error) {
			throw error;
		}
	}

	async findSubscribedPosts(reqUser: JwtPayload, offset: number = 0) {
		try {
			const subscribeInfos = await this.userService.findFollowings(
				reqUser.id,
			);

			const publisherUserIds = subscribeInfos.map(
				(info) => info.publisherId,
			);

			const posts = await this.postRepository.find({
				where: {
					userId: In(publisherUserIds),
				},
				take: 10,
				skip: offset,
			});

			return plainToInstance(FindPostMinRes, posts);
		} catch (error) {
			throw error;
		}
	}

	async findPostById(id: number) {
		try {
			const posts = await this.postRepository.findBy({
				id,
			});
			const post = posts[0];

			return post;
		} catch (error) {
			throw error;
		}
	}

	async findPost(reqUser: JwtPayload, id: number) {
		try {
			const posts = await this.postRepository.find({
				where: { id: id },
				withDeleted: true,
			});
			const post = posts[0];

			let newPost = {};

			const likePosts = await this.likePostRepository.find({
				where: {
					post: { id: id },
					user: { id: reqUser.id },
				},
			});
			let isUserLikeThis = false;
			if (likePosts.length !== 0) {
				isUserLikeThis = true;
			} else {
				isUserLikeThis = false;
			}

			const savedPosts = await this.savedPostRepository.find({
				where: {
					post: { id: id },
					user: { id: reqUser.id },
				},
			});
			let isUserSaveThis = false;
			if (savedPosts.length !== 0) {
				isUserSaveThis = true;
			} else {
				isUserSaveThis = false;
			}

			const isSubscribed = await this.userService.isSubscribed(
				reqUser.id,
				post.user.id,
			);

			newPost = { ...post, isUserLikeThis, isUserSaveThis, isSubscribed };
			return newPost;
		} catch (error) {
			throw error;
		}
	}

	// 카테고리
	async findCategories() {
		try {
			const categories = await this.categoryRepository.find({
				relations: ['subcategories'],
			});
			return categories;
		} catch (error) {
			throw error;
		}
	}

	// 태그
	async findTags(keyword: string) {
		// TODO: 속도가 느리다면 redis 이용하는 방식으로 수정
		try {
			const tags = await this.tagRepository
				.createQueryBuilder('tag')
				.where('MATCH(tag.name) AGAINST(:keyword IN BOOLEAN MODE)', {
					keyword: `${keyword}*`,
				})
				.take(5)
				.getMany();
			return tags;
		} catch (error) {
			throw error;
		}
	}

	async createComment(
		reqUser: JwtPayload,
		postId: number,
		createCommentReq: CreateCommentReq,
	) {
		try {
			const { parentId, mentionUserId, content } = createCommentReq;

			const posts = await this.postRepository.findBy({ id: postId });
			const post = posts[0];
			const user = await this.userService.findUser(reqUser.id);
			let mentionUser = null;
			if (mentionUserId) {
				mentionUser = await this.userService.findUser(mentionUserId);
			}
			const comment = this.commentRepository.create({
				parentId,
				mentionUser,
				content,
				post,
				user,
			});

			await this.postRepository.update(
				{ id: postId },
				{
					commentCount: () => 'commentCount + 1',
				},
			);

			await this.userService.updateCommentCount(reqUser.id, true);
			return await this.commentRepository.save(comment);
		} catch (error) {
			throw error;
		}
	}

	async findCommentById(id: number) {
		try {
			const comments = await this.commentRepository.findBy({ id });
			const comment = comments[0];

			return comment;
		} catch (error) {
			throw error;
		}
	}

	async findComments(reqUser: JwtPayload, postId: number) {
		try {
			const comments = await this.commentRepository.find({
				where: { post: { id: postId } },
				relations: [
					'user',
					'mentionUser',
					'likeComments',
					'likeComments.user',
				],
				order: {
					createdAt: 'ASC',
				},
				withDeleted: true,
			});

			return comments.map((comment) => {
				if (comment.deletedAt) {
					const { content, ...rest } = comment;
					const likedByCurrentUser = comment.likeComments.some(
						(likeComment) => likeComment?.user?.id === reqUser.id,
					);

					return {
						...rest,
						likedByCurrentUser,
					};
				}

				const likedByCurrentUser = comment.likeComments.some(
					(likeComment) => likeComment?.user?.id === reqUser.id,
				);

				return {
					...comment,
					likedByCurrentUser,
				};
			});
		} catch (error) {
			throw error;
		}
	}

	async createLikeComment(reqUser: JwtPayload, commentId: number) {
		try {
			const comments = await this.commentRepository.findBy({
				id: commentId,
			});
			const comment = comments[0];
			comment.likedCount += 1;
			await this.commentRepository.save(comment);

			const user = await this.userService.findUser(reqUser.id);
			const like = this.likeCommentRepository.create({
				user,
				comment,
			});
			await this.likeCommentRepository.save(like);
			return;
		} catch (error) {
			throw error;
		}
	}

	async removeLikeComment(reqUser: JwtPayload, commentId: number) {
		try {
			const comments = await this.commentRepository.findBy({
				id: commentId,
			});
			const comment = comments[0];
			comment.likedCount -= 1;
			await this.commentRepository.save(comment);

			const likes = await this.likeCommentRepository.findBy({
				user: { id: reqUser.id },
				comment: { id: commentId }, // TODO: 자기참조관계로 변경 시 수정
			});
			const like = likes[0];
			await this.likeCommentRepository.remove(like);
			return;
		} catch (error) {
			throw error;
		}
	}

	async removeComment(reqUser: JwtPayload, commentId: number) {
		try {
			const comments = await this.commentRepository.find({
				where: { id: commentId },
				relations: ['user'],
			});
			const comment = comments[0];

			if (comment.user.id === reqUser.id) {
				await this.commentRepository.softRemove(comment);
			}

			return;
		} catch (error) {
			throw error;
		}
	}

	async createLikePost(reqUser: JwtPayload, postId: number) {
		try {
			const posts = await this.postRepository.findBy({
				id: postId,
			});
			const post = posts[0];
			post.likeCount += 1;
			await this.postRepository.save(post);

			const user = await this.userService.findUser(reqUser.id);
			const like = this.likePostRepository.create({
				user,
				post,
			});
			await this.likePostRepository.save(like);
			return;
		} catch (error) {
			throw error;
		}
	}

	async removeLikePost(reqUser: JwtPayload, postId: number) {
		try {
			const posts = await this.postRepository.findBy({
				id: postId,
			});
			const post = posts[0];
			post.likeCount -= 1;
			await this.postRepository.save(post);

			const likes = await this.likePostRepository.findBy({
				user: { id: reqUser.id },
				post: { id: postId }, // TODO: 자기참조관계로 변경 시 수정
			});
			const like = likes[0];
			return await this.likePostRepository.remove(like);
		} catch (error) {
			throw error;
		}
	}

	async upPostViewCount(reqUser: JwtPayload, postId: number) {
		try {
			await this.postRepository.update(
				{ id: postId },
				{
					viewCount: () => 'viewCount + 1',
				},
			);
			return;
		} catch (error) {
			throw error;
		}
	}

	async getPostsOfUser(reqUser: JwtPayload, userId: number) {
		try {
			if (reqUser.id !== userId) {
				throw new UnauthorizedException('권한이 없습니다');
			}
			const posts = await this.postRepository.find({
				where: { userId: userId },
			});

			return posts;
		} catch (error) {
			throw error;
		}
	}

	async getCommentOfUser(reqUser: JwtPayload, userId: number) {
		try {
			if (reqUser.id !== userId) {
				throw new UnauthorizedException('권한이 없습니다');
			}
			// TODO: 삭제했던 내용도 볼 수 있음. 이를 유지할지 결정
			return await this.commentRepository.find({
				where: { user: { id: userId } },
				relations: ['post'],
				order: {
					createdAt: 'DESC',
				},
				withDeleted: true,
			});
		} catch (error) {
			throw error;
		}
	}

	async searchPosts(offset: number = 0, searchWord: string) {
		const posts = this.postRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.user', 'user')
			.where(
				'MATCH(post.title, post.excerpt, post.content) AGAINST(:searchWord IN BOOLEAN MODE)',
				{
					searchWord: `${searchWord}*`,
				},
			)
			.orderBy('post.createdAt', 'DESC')
			.take(10)
			.skip(offset)
			.getMany();

		return plainToInstance(FindPostMinRes, posts);
	}

	async savePost(reqUser: JwtPayload, postId: number) {
		try {
			const posts = await this.postRepository.findBy({
				id: postId,
			});
			const post = posts[0];

			const user = await this.userService.findUser(reqUser.id);
			const savedPost = this.savedPostRepository.create({
				user,
				post,
			});
			await this.savedPostRepository.save(savedPost);
			return;
		} catch (error) {
			throw error;
		}
	}

	async cancelSavePost(reqUser: JwtPayload, postId: number) {
		this.savedPostRepository.create();
		try {
			const savedPosts = await this.savedPostRepository.findBy({
				user: { id: reqUser.id },
				post: { id: postId },
			});
			const savedPost = savedPosts[0];
			return await this.savedPostRepository.remove(savedPost);
		} catch (error) {
			throw error;
		}
	}

	async getSavedPost(reqUser: JwtPayload) {
		try {
			const savedPosts = await this.savedPostRepository.find({
				where: { user: { id: reqUser.id } },
				relations: ['post'],
			});

			return plainToInstance(FindPopularPostMinRes, savedPosts);
		} catch (error) {
			throw error;
		}
	}
}