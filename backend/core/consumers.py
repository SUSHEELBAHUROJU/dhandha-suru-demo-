import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User

class UpdatesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user_id = self.scope['url_route']['kwargs']['user_id']
        user_type = self.scope['url_route']['kwargs']['user_type']
        
        self.user_group = f"user_{user_id}"
        self.user_type_group = f"type_{user_type}"

        # Join user-specific group
        await self.channel_layer.group_add(
            self.user_group,
            self.channel_name
        )

        # Join user-type group
        await self.channel_layer.group_add(
            self.user_type_group,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.user_group,
            self.channel_name
        )
        await self.channel_layer.group_discard(
            self.user_type_group,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        event_type = text_data_json['type']
        data = text_data_json['data']

        # Handle different event types
        if event_type == 'due_created':
            await self.channel_layer.group_send(
                f"type_retailer",
                {
                    'type': 'due_created',
                    'data': data
                }
            )
        elif event_type == 'payment_made':
            await self.channel_layer.group_send(
                f"type_supplier",
                {
                    'type': 'payment_made',
                    'data': data
                }
            )

    async def due_created(self, event):
        await self.send(text_data=json.dumps({
            'type': 'due_created',
            'data': event['data']
        }))

    async def due_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'due_updated',
            'data': event['data']
        }))

    async def payment_made(self, event):
        await self.send(text_data=json.dumps({
            'type': 'payment_made',
            'data': event['data']
        }))

    async def credit_limit_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'credit_limit_updated',
            'data': event['data']
        }))