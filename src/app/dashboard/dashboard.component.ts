

// import { Component } from '@angular/core';
// import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
// import { NgForm } from '@angular/forms';
// import { AuthService } from '../auth.service';
// import { ChangeDetectorRef } from '@angular/core';
// import { Request } from '../Models';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent {
//   isFormVisible = false;
//   requestDetails: string = '';
//   city: string = '';
//   forecast: number | null = null;
//   currentUser: any;
//   errorMessage: string = '';
//   successMessage: string = '';
//   isAdmin: boolean = false;
//   requests: any[] = [];
//   sentRequests: Request[] = [];
//   showSentRequests: boolean = false;

//   constructor(private firestore: Firestore, private authService: AuthService, private cdr: ChangeDetectorRef) {
//     this.currentUser = this.authService.getCurrentUser();
//     if (this.currentUser && this.currentUser.role && this.currentUser.role.roleName === 'admin') {
//       this.isAdmin = true;
//       this.loadRequests();
//     }
//     console.log("Current User:", this.currentUser);
//   }

//   showRequestForm() {
//     this.isFormVisible = true;
//     this.errorMessage = '';
//   }

//   async onSubmit(form: NgForm) {
//     if (!form.value.city || !form.value.forecast) {
//       this.errorMessage = 'Please enter the name of the city and select the number of days!';
//       return;
//     }

//     if (!this.currentUser || !this.currentUser.uid) {
//       this.errorMessage = 'User is not logged in or user ID is missing.';
//       return;
//     }

//     const requestData: Omit<Request, 'id'> = {
//       city: form.value.city,
//       forecast: form.value.forecast,
//       requestDetails: this.requestDetails,
//       userId: this.currentUser.uid,
//       userEmail: this.currentUser.email,
//     };

//     try {
//       const requestsCollection = collection(this.firestore, 'requests');
//       await addDoc(requestsCollection, requestData);
//       console.log("Request submitted:", requestData);
//       this.resetForm(form);
//     } catch (error) {
//       const errorMessage = (error as any).message || 'Unknown error';
//       console.error("Error submitting request:", errorMessage);
//       this.errorMessage = 'Error submitting request: ' + errorMessage;
//     }
//   }

//   async loadRequests() {
//     const requestsCollection = collection(this.firestore, 'requests');
//     const requestsSnapshot = await getDocs(requestsCollection);
//     this.requests = requestsSnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     console.log("Loaded requests:", this.requests);
//   }

//   async loadSentRequests() {
//     if (!this.currentUser || !this.currentUser.uid) {
//       this.errorMessage = 'User is not logged in or user ID is missing.';
//       return;
//     }

//     const requestsCollection = collection(this.firestore, 'requests');
//     const requestsSnapshot = await getDocs(requestsCollection);
    
//     this.sentRequests = requestsSnapshot.docs
//       .map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       })) as Request[];

//     this.sentRequests = this.sentRequests.filter((request: Request) => request.userId === this.currentUser.uid);
//     this.showSentRequests = true; 
//     console.log("Loaded sent requests:", this.sentRequests);
//   }

//   resetForm(form: NgForm) {
//     form.resetForm();
//     this.city = '';
//     this.requestDetails = '';
//     this.forecast = null;
//     this.errorMessage = '';
//   }

//   clearForm(form: NgForm) {
//     this.resetForm(form);
//   }

//   async confirmDelete(request: any, index: number) {
//     const confirmed = window.confirm("Are you sure you want to delete this request?");
    
//     if (confirmed) {
//       try {
//         const requestDoc = doc(this.firestore, `requests/${request.id}`);
//         await deleteDoc(requestDoc);

//         this.requests.splice(index, 1);
//         console.log("Request deleted:", request);
//       } catch (error) {
//         console.error("Error deleting request:", error);
//         this.errorMessage = 'Error deleting request: ' + (error as any).message;
//       }
//     }
//   }

//   async replyToRequest(request: any, index: number, replyMessage: string) {
//     if (!replyMessage) {
//       this.errorMessage = 'Reply message cannot be empty.';
//       return;
//     }

//     // Check if reply has already been sent
//     if (request.replyMessage) {
//       this.errorMessage = 'You have already replied to this request.';
//       return;
//     }

//     try {
//       const requestDoc = doc(this.firestore, `requests/${request.id}`);
//       await updateDoc(requestDoc, { replyMessage: replyMessage });

//       this.requests[index].replyMessage = replyMessage; // Store the reply message
//       this.successMessage = 'Uspješno poslan odgovor!';

//       setTimeout(() => {
//         this.successMessage = '';
//       }, 3000);

//       console.log("Reply sent:", replyMessage);
//     } catch (error) {
//       console.error("Error sending reply:", error);
//       this.errorMessage = 'Error sending reply: ' + (error as any).message;
//     }
//   }
// }




import { Component } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { Request } from '../Models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isFormVisible = false;
  requestDetails: string = '';
  city: string = '';
  forecast: number | null = null;
  currentUser: any;
  errorMessage: string = '';
  successMessage: string = '';
  isAdmin: boolean = false;
  requests: any[] = [];
  sentRequests: Request[] = [];
  showSentRequests: boolean = false;

  constructor(private firestore: Firestore, private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser && this.currentUser.role && this.currentUser.role.roleName === 'admin') {
      this.isAdmin = true;
      this.loadRequests();
    }
    console.log("Current User:", this.currentUser);
  }

  showRequestForm() {
    this.isFormVisible = true;
    this.errorMessage = '';
  }

  async onSubmit(form: NgForm) {
    if (!form.value.city || !form.value.forecast) {
      this.errorMessage = 'Please enter the name of the city and select the number of days!';
      return;
    }

    if (!this.currentUser || !this.currentUser.uid) {
      this.errorMessage = 'User is not logged in or user ID is missing.';
      return;
    }

    const requestData: Omit<Request, 'id'> = {
      city: form.value.city,
      forecast: form.value.forecast,
      requestDetails: this.requestDetails,
      userId: this.currentUser.uid,
      userEmail: this.currentUser.email,
    };

    try {
      const requestsCollection = collection(this.firestore, 'requests');
      await addDoc(requestsCollection, requestData);
      console.log("Request submitted:", requestData);
      this.resetForm(form);
    } catch (error) {
      const errorMessage = (error as any).message || 'Unknown error';
      console.error("Error submitting request:", errorMessage);
      this.errorMessage = 'Error submitting request: ' + errorMessage;
    }
  }

  async loadRequests() {
    const requestsCollection = collection(this.firestore, 'requests');
    const requestsSnapshot = await getDocs(requestsCollection);
    this.requests = requestsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      currentReplyMessage: '', 
      isReplying: false 
    }));
    console.log("Loaded requests:", this.requests);
  }

  async loadSentRequests() {
    if (!this.currentUser || !this.currentUser.uid) {
      this.errorMessage = 'User is not logged in or user ID is missing.';
      return;
    }

    const requestsCollection = collection(this.firestore, 'requests');
    const requestsSnapshot = await getDocs(requestsCollection);
    
    this.sentRequests = requestsSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Request[];

    this.sentRequests = this.sentRequests.filter((request: Request) => request.userId === this.currentUser.uid);
    this.showSentRequests = true; 
    console.log("Loaded sent requests:", this.sentRequests);
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.city = '';
    this.requestDetails = '';
    this.forecast = null;
    this.errorMessage = '';
  }

  clearForm(form: NgForm) {
    this.resetForm(form);
  }

  async confirmDelete(request: any, index: number) {
    const confirmed = window.confirm("Are you sure you want to delete this request?");
    
    if (confirmed) {
      try {
        const requestDoc = doc(this.firestore, `requests/${request.id}`);
        await deleteDoc(requestDoc);

        this.requests.splice(index, 1);
        console.log("Request deleted:", request);
      } catch (error) {
        console.error("Error deleting request:", error);
        this.errorMessage = 'Error deleting request: ' + (error as any).message;
      }
    }
  }

  toggleReply(request: any) {
    request.isReplying = !request.isReplying;
    this.cdr.detectChanges();
  }

  async replyToRequest(request: any, index: number) {
    const replyMessage = request.currentReplyMessage; 
    if (!replyMessage) {
      this.errorMessage = 'Please write a reply before sending.';
      return;
    }

    try {
      const requestDoc = doc(this.firestore, `requests/${request.id}`);
      await updateDoc(requestDoc, { replyMessage: replyMessage });
   
      this.requests[index].replyMessage = replyMessage;
      this.requests[index].currentReplyMessage = '';
      this.requests[index].isReplying = false; 
      this.successMessage = 'Reply sent successfully!';
      console.log("Reply sent:", replyMessage);
    } catch (error) {
      console.error("Error sending reply:", error);
      this.errorMessage = 'Error sending reply: ' + (error as any).message;
    }
  }
}
