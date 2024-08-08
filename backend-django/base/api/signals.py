from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Messages
from base.llm.info_gathering_2 import chatbot_conversation



@receiver(post_save, sender=Messages)
def handle_new_message(sender, instance, created, **kwargs):
    if created and instance.sender.id != 1:

        print(f"Sender ID: {instance.sender.id}")
        print(f"Is Staff: {instance.sender.is_staff}")
        print(f"Is Superuser: {instance.sender.is_superuser}")

        if instance.sender.is_superuser or instance.sender.is_staff:
            return

        message_content = f"{instance.content}, and answer the question in {instance.sender.language}"

        if message_content.lower() in {"q", "quit"}:
            content = "Daisy: Byebye"
        else:
            try:
                print("instance_sender_id: ", instance.sender.id)
                chatbot_response = chatbot_conversation(
                    message_content,
                    instance.sender.id,
                )
                content = chatbot_response
            except Exception as e:
                content = f"Sorry, I encountered an error: {str(e)}"

        llm_response = Messages.objects.create(
            recipient=instance.sender, sender=instance.recipient, content=content
        )

        recipient_messages_count = Messages.objects.filter(
            recipient=instance.sender
        ).count()
        if (
            recipient_messages_count >= 1
            and instance.sender.chat_status != "In progress"
        ):
            print("inside the condition")
            instance.sender.chat_status = "In progress"
            instance.sender.save()
