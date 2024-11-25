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
import { CreateCommentReq, FindCommentsReq } from './dto/comment.dto';
import { CreatePostReq, FindPostMinRes, FindPostRes } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@UseGuards(AuthGuard)
	@Get()
	async findPosts() {
		const posts = await this.postService.findPosts();
		return plainToInstance(FindPostMinRes, posts);
	}

	@UseGuards(AuthGuard)
	@Get('category')
	async findCategories() {
		return await this.postService.findCategories();
	}

	@UseGuards(AuthGuard)
	@Post()
	async createPost(@Req() req: any, @Body() createPostReq: CreatePostReq) {
		return await this.postService.createPost(req.user, createPostReq);
	}

	@UseGuards(AuthGuard)
	@Get('comment')
	async findComments(@Query() findCommentsReq: FindCommentsReq) {
		const comments = await this.postService.findComments(findCommentsReq);
		// return plainToInstance(FindCommentsReq, comments);
		return comments;
	}

	@UseGuards(AuthGuard)
	@Post('comment')
	async createComment(
		@Req() req: any,
		@Body() createCommentReq: CreateCommentReq,
	) {
		return await this.postService.createComment(req.user, createCommentReq);
	}

	@UseGuards(AuthGuard)
	@Get('tag')
	async findTags(@Query('keyword') keyword: string) {
		return await this.postService.findTags(keyword);
	}

	@UseGuards(AuthGuard)
	@Get(':id')
	async findPost(@Param('id', ParseIntPipe) id: number) {
		return plainToInstance(
			FindPostRes,
			await this.postService.findPost(id),
		);
	}
}
