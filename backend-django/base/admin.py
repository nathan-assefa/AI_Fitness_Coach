from django.contrib import admin
from base.models import User
from base.api.models import Subscription, Messages, Document

admin.site.register(User)
admin.site.register(Subscription)
admin.site.register(Messages)
admin.site.register(Document)
