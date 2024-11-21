from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, RetailerProfile, BankDetails, Document, CreditAssessment,
    Transaction, Payment, DueEntry, ExistingLoan
)

class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = '__all__'

class RetailerProfileSerializer(serializers.ModelSerializer):
    """Serializer for RetailerProfile model."""
    user_profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = RetailerProfile
        fields = '__all__'

class BankDetailsSerializer(serializers.ModelSerializer):
    """Serializer for BankDetails model."""
    class Meta:
        model = BankDetails
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for Document model."""
    class Meta:
        model = Document
        fields = '__all__'

class CreditAssessmentSerializer(serializers.ModelSerializer):
    retailer_name = serializers.CharField(source='retailer.user_profile.business_name', read_only=True)
    
    class Meta:
        model = CreditAssessment
        fields = (
            'id', 'retailer', 'retailer_name', 'credit_score', 'status',
            'approved_limit', 'assessment_date', 'updated_at', 'notes'
        )
        read_only_fields = ('assessment_date', 'updated_at')

class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction model."""
    supplier_name = serializers.CharField(
        source='supplier.business_name', 
        read_only=True
    )
    retailer_name = serializers.CharField(
        source='retailer.business_name', 
        read_only=True
    )

    class Meta:
        model = Transaction
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""
    class Meta:
        model = Payment
        fields = '__all__'

class DueEntrySerializer(serializers.ModelSerializer):
    """Serializer for DueEntry model."""
    supplier_name = serializers.CharField(
        source='supplier.business_name', 
        read_only=True
    )
    retailer_name = serializers.CharField(
        source='retailer.business_name', 
        read_only=True
    )
    retailer_phone = serializers.CharField(
        source='retailer.phone', 
        read_only=True
    )

    class Meta:
        model = DueEntry
        fields = (
            'id', 'supplier', 'retailer', 'amount', 'description',
            'purchase_date', 'due_date', 'status', 'created_at',
            'updated_at', 'supplier_name', 'retailer_name', 'retailer_phone'
        )
        read_only_fields = ('supplier_name', 'retailer_name', 'retailer_phone')

class ExistingLoanSerializer(serializers.ModelSerializer):
    """Serializer for ExistingLoan model."""
    class Meta:
        model = ExistingLoan
        fields = '__all__'
