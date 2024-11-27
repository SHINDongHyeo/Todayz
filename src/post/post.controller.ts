import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards,
	Req,
	ParseIntPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/_common/guards/jwt/auth.guard';
import {
	CreateCommentReq,
	FindCommentsReq,
	FindCommentsRes,
} from './dto/comment.dto';
import { CreatePostReq, FindPostMinRes, FindPostRes } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	// 게시물
	@UseGuards(AuthGuard)
	@Get()
	async findPosts() {
		const posts = await this.postService.findPosts();
		return plainToInstance(FindPostMinRes, posts);
	}

	@UseGuards(AuthGuard)
	@Post()
	async createPost(@Req() req: any, @Body() createPostReq: CreatePostReq) {
		return await this.postService.createPost(req.user, createPostReq);
	}

	// 카테고리
	@UseGuards(AuthGuard)
	@Get('category')
	async findCategories() {
		return await this.postService.findCategories();
	}

	// 댓글
	@UseGuards(AuthGuard)
	@Get('comment')
	async findComments(
		@Req() req: any,
		@Query() findCommentsReq: FindCommentsReq,
	) {
		const comments = await this.postService.findComments(
			req.user,
			findCommentsReq,
		);
		return plainToInstance(FindCommentsRes, comments);
	}

	@UseGuards(AuthGuard)
	@Post('comment')
	async createComment(
		@Req() req: any,
		@Body() createCommentReq: CreateCommentReq,
	) {
		await this.postService.createComment(req.user, createCommentReq);
		return;
	}

	// 태그
	@UseGuards(AuthGuard)
	@Get('tag')
	async findTags(@Query('keyword') keyword: string) {
		return await this.postService.findTags(keyword);
	}

	///////////////////////////// 동적 라우팅 ////////////////////////////////////
	// 게시물
	@UseGuards(AuthGuard)
	@Get(':id')
	async findPost(@Param('id', ParseIntPipe) id: number) {
		return plainToInstance(
			FindPostRes,
			await this.postService.findPost(id),
		);
	}

	// 댓글
	@UseGuards(AuthGuard)
	@Post('comment/:id/like')
	async createlikeComment(
		@Req() req: any,
		@Param('id', ParseIntPipe) commentId: number,
	) {
		await this.postService.createlikeComment(req.user, commentId);
		return;
	}

	@UseGuards(AuthGuard)
	@Delete('comment/:id/like')
	async removelikeComment(
		@Req() req: any,
		@Param('id', ParseIntPipe) commentId: number,
	) {
		await this.postService.removelikeComment(req.user, commentId);
		return;
	}
}
