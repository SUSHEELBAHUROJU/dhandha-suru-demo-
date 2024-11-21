from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=[
        ('supplier', 'Supplier'),
        ('retailer', 'Retailer'),
        ('fintech', 'Fintech')
    ])
    business_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15, null=True, blank=True)
    gst_number = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    registration_number = models.CharField(max_length=50, null=True, blank=True)
    license_number = models.CharField(max_length=50, null=True, blank=True)
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  
    def __str__(self):
        return f"{self.business_name} ({self.user_type})"

class RetailerProfile(models.Model):
    user_profile = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    pan_number = models.CharField(max_length=10, null=True, blank=True)
    annual_turnover = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    years_in_business = models.IntegerField(default=0)
    business_type = models.CharField(max_length=50, default='retail_store')
    shop_ownership = models.CharField(max_length=20, choices=[
        ('owned', 'Owned'),
        ('rented', 'Rented')
    ], default='rented')
    monthly_rent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    employee_count = models.IntegerField(default=1)
    bank_statement_score = models.IntegerField(null=True, blank=True)
    credit_score = models.IntegerField(null=True, blank=True)
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    available_credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Retailer Profile - {self.user_profile.business_name}"

class BankDetails(models.Model):
    retailer = models.OneToOneField(RetailerProfile, on_delete=models.CASCADE)
    account_number = models.CharField(max_length=50, null=True, blank=True)
    ifsc_code = models.CharField(max_length=11, null=True, blank=True)
    bank_name = models.CharField(max_length=100, null=True, blank=True)
    bank_branch = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Bank Details - {self.retailer.user_profile.business_name}"

class ExistingLoan(models.Model):
    retailer = models.ForeignKey(RetailerProfile, on_delete=models.CASCADE)
    loan_amount = models.DecimalField(max_digits=12, decimal_places=2)
    loan_provider = models.CharField(max_length=100)
    monthly_emi = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Loan - {self.retailer.user_profile.business_name}"

class Document(models.Model):
    retailer = models.ForeignKey(RetailerProfile, on_delete=models.CASCADE)
    document_type = models.CharField(max_length=50, choices=[
        ('gst_certificate', 'GST Certificate'),
        ('bank_statement', 'Bank Statement'),
        ('financial_statement', 'Financial Statement'),
        ('shop_license', 'Shop License'),
        ('ownership_docs', 'Ownership Documents')
    ])
    file = models.FileField(upload_to='retailer_documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document_type} - {self.retailer.user_profile.business_name}"

class CreditAssessment(models.Model):
    retailer = models.ForeignKey(RetailerProfile, on_delete=models.CASCADE)
    credit_score = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    approved_limit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    assessment_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Credit Assessment - {self.retailer.user_profile.business_name}"

class Transaction(models.Model):
    supplier = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='supplied_transactions')
    retailer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=200)
    status = models.CharField(max_length=10, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField()

    def __str__(self):
        return f"Transaction - {self.supplier.business_name} to {self.retailer.business_name}"

class Payment(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=50)
    status = models.CharField(max_length=10)
    reference_id = models.CharField(max_length=100)

    def __str__(self):
        return f"Payment - {self.transaction.id}"

class DueEntry(models.Model):
    supplier = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='given_dues')
    retailer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_dues')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    purchase_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Due Entry - {self.supplier.business_name} to {self.retailer.business_name}"