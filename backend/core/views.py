from django.shortcuts import get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import UserProfile, RetailerProfile, DueEntry, Transaction, Payment, BankDetails, CreditAssessment, ExistingLoan
from .serializers import (
    UserProfileSerializer, RetailerProfileSerializer, DueEntrySerializer,
    TransactionSerializer, BankDetailsSerializer,PaymentSerializer,CreditAssessmentSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        user_type = request.data.get('user_type')
        if not user_type in ['retailer', 'supplier', 'fintech']:
            return Response({
                'error': 'Invalid user type'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate required fields
        business_name = request.data.get('business_name')
        if not business_name:
            return Response({
                'error': 'Business name is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create User
        user_data = request.data.get('user', {})
        user = User.objects.create_user(
            username=user_data.get('email'),
            email=user_data.get('email'),
            password=user_data.get('password'),
            first_name=user_data.get('firstName', '')
        )

        # Create UserProfile
        user_profile = UserProfile.objects.create(
            user=user,
            user_type=user_type,
            business_name=business_name,
            phone=request.data.get('phone'),
            gst_number=request.data.get('gst_number'),
            address=request.data.get('address')
        )

        # Create RetailerProfile if user is a retailer
        if user_type == 'retailer':
            RetailerProfile.objects.create(
                user_profile=user_profile,
                business_type=request.data.get('business_type', 'retail_store'),
                years_in_business=request.data.get('years_in_business', 0),
                annual_turnover=request.data.get('annual_turnover', 0)
            )

        login(request, user)
        
        return Response({
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'user_type': user_type,
                'business_name': user_profile.business_name
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        if 'user' in locals():
            user.delete()
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_fintech(request):
    """Register a new fintech company"""
    try:
        with transaction.atomic():
            # Create Django User
            user_data = {
                'username': request.data['email'],
                'email': request.data['email'],
                'password': request.data['password']
            }
            user = User.objects.create_user(**user_data)

            # Create UserProfile for fintech
            user_profile = UserProfile.objects.create(
                user=user,
                user_type='fintech',
                business_name=request.data['business_name'],
                phone=request.data.get('phone'),
                gst_number=request.data.get('gst_number'),
                address=request.data.get('address'),
                registration_number=request.data.get('registrationNumber'),
                license_number=request.data.get('licenseNumber'),
                credit_limit=request.data.get('creditLimit'),
                interest_rate=request.data.get('interestRate')
            )

            # Log the user in
            login(request, user)

            return Response({
                'message': 'Fintech registration successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'user_type': user_profile.user_type,
                    'business_name': user_profile.business_name
                }
            }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            user_profile = UserProfile.objects.get(user=user)
            login(request, user)
            return Response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'user_type': user_profile.user_type,
                    'business_name': user_profile.business_name
                }
            })
    except User.DoesNotExist:
        pass
    
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    try:
        if user_profile.user_type == 'retailer':
            retailer_profile = get_object_or_404(RetailerProfile, user_profile=user_profile)
            
            total_due = DueEntry.objects.filter(
                retailer=user_profile,
                status__in=['pending', 'overdue']
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            due_today = DueEntry.objects.filter(
                retailer=user_profile,
                status='pending',
                due_date=timezone.now().date()
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            overdue_amount = DueEntry.objects.filter(
                retailer=user_profile,
                status='overdue'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            return Response({
                'totalDue': total_due,
                'dueToday': due_today,
                'overdueAmount': overdue_amount,
                'creditLimit': retailer_profile.credit_limit,
                'availableCredit': retailer_profile.available_credit,
                'creditScore': retailer_profile.credit_score or 0
            })
            
        elif user_profile.user_type == 'supplier':
            total_outstanding = DueEntry.objects.filter(
                supplier=user_profile,
                status__in=['pending', 'overdue']
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            active_retailers = DueEntry.objects.filter(
                supplier=user_profile
            ).values('retailer').distinct().count()
            
            monthly_sales = Transaction.objects.filter(
                supplier=user_profile,
                created_at__gte=timezone.now() - timedelta(days=30)
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            overdue_amount = DueEntry.objects.filter(
                supplier=user_profile,
                status='overdue'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            return Response({
                'totalOutstanding': total_outstanding,
                'activeRetailers': active_retailers,
                'monthlySales': monthly_sales,
                'overdueAmount': overdue_amount
            })
        
        return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if user_profile.user_type == 'retailer':
        transactions = Transaction.objects.filter(retailer=user_profile)
    elif user_profile.user_type == 'supplier':
        transactions = Transaction.objects.filter(supplier=user_profile)
    else:
        return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transaction_history(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if user_profile.user_type == 'retailer':
        transactions = Transaction.objects.filter(
            retailer=user_profile
        ).order_by('-created_at')[:10]
    elif user_profile.user_type == 'supplier':
        transactions = Transaction.objects.filter(
            supplier=user_profile
        ).order_by('-created_at')[:10]
    else:
        return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_analytics(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if user_profile.user_type == 'supplier':
        # Get last 6 months of data
        end_date = timezone.now()
        start_date = end_date - timedelta(days=180)
        
        # Transaction trends
        transactions = Transaction.objects.filter(
            supplier=user_profile,
            created_at__range=(start_date, end_date)
        ).values('created_at__date').annotate(
            amount=Sum('amount')
        ).order_by('created_at__date')
        
        # Payment trends
        payment_trends = DueEntry.objects.filter(
            supplier=user_profile,
            created_at__range=(start_date, end_date)
        ).values('created_at__month').annotate(
            on_time=Count('id', filter=Q(status='paid')),
            late=Count('id', filter=Q(status='overdue'))
        ).order_by('created_at__month')
        
        # Retailer growth
        retailer_growth = DueEntry.objects.filter(
            supplier=user_profile,
            created_at__range=(start_date, end_date)
        ).values('created_at__month').annotate(
            count=Count('retailer', distinct=True)
        ).order_by('created_at__month')
        
        return Response({
            'transactions': transactions,
            'paymentTrends': payment_trends,
            'retailerGrowth': retailer_growth
        })
    
    return Response({'error': 'Invalid user type'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_retailers(request):
    """Get list of retailers"""
    try:
        retailers = UserProfile.objects.filter(user_type='retailer')
        serializer = UserProfileSerializer(retailers, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_retailer_details(request, retailer_id):
    """Get detailed information about a specific retailer"""
    try:
        retailer = get_object_or_404(UserProfile, id=retailer_id, user_type='retailer')
        retailer_profile = get_object_or_404(RetailerProfile, user_profile=retailer)
        
        total_dues = DueEntry.objects.filter(
            retailer=retailer,
            status__in=['pending', 'overdue']
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        payment_history = DueEntry.objects.filter(
            retailer=retailer,
            status='paid'
        ).count()
        
        data = {
            **RetailerProfileSerializer(retailer_profile).data,
            'total_dues': total_dues,
            'payment_history': payment_history
        }
        
        return Response(data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dues(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if user_profile.user_type == 'supplier':
        dues_list = DueEntry.objects.filter(supplier=user_profile)
    else:  # retailer
        dues_list = DueEntry.objects.filter(retailer=user_profile)
        
    serializer = DueEntrySerializer(dues_list, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_due(request):
    """Create a new due entry"""
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if user_profile.user_type != 'supplier':
        return Response(
            {'error': 'Only suppliers can create due entries'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        retailer = get_object_or_404(UserProfile, id=request.data.get('retailer'))
        
        if retailer.user_type != 'retailer':
            return Response(
                {'error': 'Selected user is not a retailer'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        due_data = {
            'supplier': user_profile.id,
            'retailer': retailer.id,
            'amount': request.data.get('amount'),
            'description': request.data.get('description'),
            'purchase_date': request.data.get('purchase_date'),
            'due_date': request.data.get('due_date'),
            'status': 'pending'
        }
        
        serializer = DueEntrySerializer(data=due_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_retailers(request):
    query = request.GET.get('q', '')
    retailers = UserProfile.objects.filter(
        user_type='retailer',
        business_name__icontains=query
    )
    serializer = UserProfileSerializer(retailers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_retailers(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    if user_profile.user_type != 'supplier':
        return Response(
            {'error': 'Only suppliers can access recent retailers'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    recent_dues = DueEntry.objects.filter(supplier=user_profile).values('retailer').distinct()[:5]
    retailer_ids = [due['retailer'] for due in recent_dues]
    retailers = UserProfile.objects.filter(id__in=retailer_ids)
    
    serializer = UserProfileSerializer(retailers, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dues(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if request.method == 'GET':
        if user_profile.user_type == 'supplier':
            dues_list = DueEntry.objects.filter(supplier=user_profile)
        else:  # retailer
            dues_list = DueEntry.objects.filter(retailer=user_profile)
            
        serializer = DueEntrySerializer(dues_list, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if user_profile.user_type != 'supplier':
            return Response(
                {'error': 'Only suppliers can create due entries'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        retailer = get_object_or_404(UserProfile, id=request.data['retailer'])
        
        due_data = {
            'supplier': user_profile.id,
            'retailer': retailer.id,
            'amount': request.data['amount'],
            'description': request.data['description'],
            'purchase_date': request.data['purchase_date'],
            'due_date': request.data['due_date'],
            'status': 'pending'
        }
        
        serializer = DueEntrySerializer(data=due_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def due_detail(request, due_id):
    due = get_object_or_404(DueEntry, id=due_id)
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if user_profile not in [due.supplier, due.retailer]:
        return Response(
            {'error': 'You do not have permission to access this due'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if request.method == 'GET':
        serializer = DueEntrySerializer(due)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        if user_profile != due.supplier:
            return Response(
                {'error': 'Only suppliers can update due entries'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = DueEntrySerializer(due, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        if user_profile != due.supplier:
            return Response(
                {'error': 'Only suppliers can delete due entries'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        due.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def make_payment(request, due_id):
    due = get_object_or_404(DueEntry, id=due_id)
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if user_profile != due.retailer:
        return Response(
            {'error': 'Only retailers can make payments'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    if due.status == 'paid':
        return Response(
            {'error': 'This due has already been paid'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    payment = Payment.objects.create(
        transaction=due,
        amount=request.data['amount'],
        payment_method=request.data['payment_method'],
        status='completed',
        reference_id=request.data.get('reference_id', '')
    )
    
    due.status = 'paid'
    due.save()
    
    return Response({'message': 'Payment successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if user_profile.user_type == 'supplier':
        transactions = Transaction.objects.filter(supplier=user_profile)
    else:  # retailer
        transactions = Transaction.objects.filter(retailer=user_profile)
        
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transaction_history(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    
    if user_profile.user_type == 'supplier':
        transactions = Transaction.objects.filter(supplier=user_profile)
    else:  # retailer
        transactions = Transaction.objects.filter(retailer=user_profile)
        
    transactions = transactions.order_by('-created_at')[:10]  # Get last 10 transactions
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    """Get dashboard statistics for the current user"""
    try:
        user_profile = get_object_or_404(UserProfile, user=request.user)
        
        if user_profile.user_type == 'supplier':
            total_outstanding = DueEntry.objects.filter(
                supplier=user_profile,
                status__in=['pending', 'overdue']
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            active_retailers = DueEntry.objects.filter(
                supplier=user_profile
            ).values('retailer').distinct().count()
            
            monthly_sales = Transaction.objects.filter(
                supplier=user_profile,
                created_at__gte=timezone.now() - timedelta(days=30)
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            overdue_amount = DueEntry.objects.filter(
                supplier=user_profile,
                status='overdue'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            return Response({
                'totalOutstanding': total_outstanding,
                'activeRetailers': active_retailers,
                'monthlySales': monthly_sales,
                'overdueAmount': overdue_amount
            })
        
        elif user_profile.user_type == 'retailer':
            retailer_profile = get_object_or_404(RetailerProfile, user_profile=user_profile)
            
            total_due = DueEntry.objects.filter(
                retailer=user_profile,
                status__in=['pending', 'overdue']
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            due_today = DueEntry.objects.filter(
                retailer=user_profile,
                status='pending',
                due_date=timezone.now().date()
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            overdue_amount = DueEntry.objects.filter(
                retailer=user_profile,
                status='overdue'
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            return Response({
                'totalDue': total_due,
                'dueToday': due_today,
                'overdueAmount': overdue_amount,
                'creditLimit': retailer_profile.credit_limit,
                'availableCredit': retailer_profile.available_credit,
                'creditScore': retailer_profile.credit_score or 0
            })
        
        return Response(
            {'error': 'Invalid user type'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_credit_assessment(request):
    """Submit a credit assessment request"""
    try:
        user_profile = get_object_or_404(UserProfile, user=request.user)
        
        if user_profile.user_type != 'retailer':
            return Response(
                {'error': 'Only retailers can request credit assessment'},
                status=status.HTTP_403_FORBIDDEN
            )

        retailer_profile = get_object_or_404(RetailerProfile, user_profile=user_profile)

        # Update retailer profile with assessment data
        retailer_profile.business_type = request.data.get('businessType', '')
        retailer_profile.years_in_business = request.data.get('yearsInBusiness', 0)
        retailer_profile.annual_turnover = request.data.get('annualTurnover', 0)
        retailer_profile.employee_count = request.data.get('employeeCount', 1)
        retailer_profile.shop_ownership = request.data.get('shopOwnership', 'rented')
        if request.data.get('shopOwnership') == 'rented':
            retailer_profile.monthly_rent = request.data.get('monthlyRent', 0)
        retailer_profile.save()

        # Create or update bank details
        bank_details, _ = BankDetails.objects.get_or_create(retailer=retailer_profile)
        bank_details.account_number = request.data.get('bankAccountNumber', '')
        bank_details.ifsc_code = request.data.get('ifscCode', '')
        bank_details.bank_name = request.data.get('bankName', '')
        bank_details.bank_branch = request.data.get('bankBranch', '')
        bank_details.save()

        # Handle existing loans if any
        if request.data.get('existingLoans'):
            ExistingLoan.objects.create(
                retailer=retailer_profile,
                loan_amount=request.data.get('loanAmount', 0),
                loan_provider=request.data.get('loanProvider', ''),
                monthly_emi=request.data.get('monthlyEmi', 0)
            )

        # Create credit assessment entry
        assessment = CreditAssessment.objects.create(
            retailer=retailer_profile,
            status='pending',
            notes='Credit assessment requested by retailer'
        )

        return Response({
            'message': 'Credit assessment request submitted successfully',
            'assessment_id': assessment.id
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_credit_assessment_status(request):
    """Get the status of the latest credit assessment"""
    try:
        user_profile = get_object_or_404(UserProfile, user=request.user)
        
        if user_profile.user_type != 'retailer':
            return Response(
                {'error': 'Only retailers can view credit assessment status'},
                status=status.HTTP_403_FORBIDDEN
            )

        retailer_profile = get_object_or_404(RetailerProfile, user_profile=user_profile)
        
        # Get the latest assessment
        latest_assessment = CreditAssessment.objects.filter(
            retailer=retailer_profile
        ).order_by('-assessment_date').first()

        if not latest_assessment:
            return Response({
                'status': 'none',
                'message': 'No credit assessment found'
            })

        return Response({
            'status': latest_assessment.status,
            'creditScore': latest_assessment.credit_score,
            'creditLimit': latest_assessment.approved_limit,
            'message': latest_assessment.notes,
            'assessmentDate': latest_assessment.assessment_date
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )