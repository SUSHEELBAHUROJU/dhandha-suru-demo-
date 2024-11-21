from django.contrib import admin
from .models import (
    UserProfile,
    RetailerProfile,
    BankDetails,
    ExistingLoan,
    Document,
    CreditAssessment,
    Transaction,
    Payment,
    DueEntry
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'user_type', 'business_name', 'phone')
    list_filter = ('user_type',)
    search_fields = ('user__username', 'business_name', 'phone')

@admin.register(RetailerProfile)
class RetailerProfileAdmin(admin.ModelAdmin):
    list_display = ('user_profile', 'business_type', 'years_in_business', 'credit_score')
    list_filter = ('business_type', 'shop_ownership')
    search_fields = ('user_profile__business_name', 'pan_number')

@admin.register(BankDetails)
class BankDetailsAdmin(admin.ModelAdmin):
    list_display = ('retailer', 'bank_name', 'account_number', 'ifsc_code')
    search_fields = ('retailer__user_profile__business_name', 'bank_name', 'account_number')

@admin.register(ExistingLoan)
class ExistingLoanAdmin(admin.ModelAdmin):
    list_display = ('retailer', 'loan_amount', 'loan_provider', 'monthly_emi', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('retailer__user_profile__business_name', 'loan_provider')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('retailer', 'document_type', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('retailer__user_profile__business_name',)

@admin.register(CreditAssessment)
class CreditAssessmentAdmin(admin.ModelAdmin):
    list_display = ('retailer', 'credit_score', 'status', 'approved_limit', 'assessment_date')
    list_filter = ('status', 'assessment_date')
    search_fields = ('retailer__user_profile__business_name',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'retailer', 'amount', 'status', 'created_at', 'due_date')
    list_filter = ('status', 'created_at')
    search_fields = ('supplier__business_name', 'retailer__business_name')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction', 'amount', 'payment_method', 'status', 'payment_date')
    list_filter = ('status', 'payment_date', 'payment_method')
    search_fields = ('transaction__supplier__business_name', 'transaction__retailer__business_name')

@admin.register(DueEntry)
class DueEntryAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'retailer', 'amount', 'status', 'due_date')
    list_filter = ('status', 'due_date')
    search_fields = ('supplier__business_name', 'retailer__business_name')