import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketServer,
	OnGatewayInit,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DebateService } from 'src/debate/debate.service';
import { TooManyDiscussorException } from 'src/debate/exceptions/TooManyDiscussor.exception';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class DebateChatGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	constructor(private readonly debateService: DebateService) {}

	afterInit(server: Server) {
		console.log('WebSocket Gateway Initialized');
	}

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		client.rooms.forEach((roomId) => {
			client.leave(roomId);
		});
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('join')
	async handleJoin(
		@MessageBody()
		payload: { userId: number; userNickname: string; roomId: string },
		@ConnectedSocket() client: Socket,
	) {
		try {
			const { userId, userNickname, roomId } = payload;

			const users = Array.from(
				this.server.sockets.adapter.rooms.get(roomId) || [],
			);
			const userCount = users.length;
			await this.debateService.updateDiscussantCount(
				Number(roomId),
				userCount + 1,
			);

			client.join(roomId);
			this.server.to(roomId).emit('users', {
				userId,
				userNickname,
				type: 'join',
				joiningUsers: users,
			});
			console.log(`Client connected handleJoin: ${client.id}, ${roomId}`);
		} catch (error) {
			if (error instanceof TooManyDiscussorException) {
				client.emit('error', error.message);
			} else {
				client.emit('error', 'Failed to join room. Please try again.');
			}
		}
	}

	@SubscribeMessage('leave')
	async handleLeave(
		@MessageBody()
		payload: { userId: number; userNickname: string; roomId: string },
		@ConnectedSocket() client: Socket,
	) {
		try {
			const { userId, userNickname, roomId } = payload;

			const users = Array.from(
				this.server.sockets.adapter.rooms.get(roomId) || [],
			);
			const userCount = users.length;
			await this.debateService.updateDiscussantCount(
				Number(roomId),
				userCount - 1,
			);

			client.leave(roomId);
			const usersInRoom = Array.from(
				this.server.sockets.adapter.rooms.get(roomId) || [],
			);
			this.server
				.to(roomId)
				.emit('users', { userId, userNickname, type: 'leave' });
			console.log(
				`Client disconnected handleLeave: ${client.id}, ${roomId}`,
			);
		} catch (error) {
			client.emit('error', 'Failed to leave room. Please try again.');
		}
	}

	@SubscribeMessage('message')
	handleMessage(
		@MessageBody()
		payload: {
			userId: number;
			userNickname: string;
			roomId: string;
			message: string;
		},
		@ConnectedSocket() client: Socket,
	) {
		const { userId, userNickname, roomId, message } = payload;

		this.server
			.to(roomId)
			.emit('message', { userId, userNickname, message, type: 'msg' });
		console.log(`message: ${userNickname}, ${roomId}, ${message}`);
	}
}
