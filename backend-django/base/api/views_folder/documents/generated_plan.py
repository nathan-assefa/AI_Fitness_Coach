from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from ...models import Document
from rest_framework import status

class DownloadRecentDocument(APIView):
    def get(self, request, user_id):
        try:
            document = Document.objects.filter(user_id=user_id).order_by('-generated_at').first()
            if not document:
                return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)


            response = HttpResponse(document.file_data, content_type='application/msword')
            response['Content-Disposition'] = f'attachment; filename="{document.file_name}"'

            return response
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
