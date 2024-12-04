import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class DebateChatGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	private clients = new Set<any>();

	handleConnection(client: any) {
		this.clients.add(client);
		console.log(`Client connected: ${client.id}`);
	}
	handleDisconnect(client: any) {
		this.clients.delete(client);
		console.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('message')
	handleMessage(@MessageBody() data: string, client: any): void {
		console.log(`Message from: ${client.id}: ${data}`);
		this.clients.forEach((client) => {
			client.emit('message', data);
		});
	}
}
