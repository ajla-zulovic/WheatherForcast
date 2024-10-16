import { Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { from, Observable, BehaviorSubject } from "rxjs";
import { environment } from "./environments/environment";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { Roles, User } from './Models';
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth: Auth;
  db: any;
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable(); 

  constructor(private router: Router) {
    const app = initializeApp(environment.firebaseConfig); 
    this.firebaseAuth = getAuth(app);
    this.db = getFirestore(app);

    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    this.loggedIn.next(isLoggedIn === 'true');
  }


  // register(email: string, username: string, password: string): Observable<void> {
  //   const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
  //     .then(async (response) => {
  //       await updateProfile(response.user, { displayName: username });
  //       await setDoc(doc(this.db, 'users', response.user.uid), {
  //         email: response.user.email,
  //         username: username,
  //         role: 'user'  
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Registration error:', error.message);
  //       throw error;
  //     });
  
  //   return from(promise);
  // }


  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(async (response) => {
        // Ažuriranje profila korisnika sa username-om
        await updateProfile(response.user, { displayName: username });
        
        // Čuvanje korisničkih podataka u Firestore-u
        await setDoc(doc(this.db, 'users', response.user.uid), {
          email: response.user.email,
          username: username,
          roleId: 1, // Ovo možete postaviti kao 1 (za "user")
          roleName: 'user'  // Automatski postavljanje role na "user"
        });
      })
      .catch(error => {
        console.error('Registration error:', error.message);
        throw error;
      });
  
    return from(promise);
  }
  

  
  // login(email: string, password: string): Observable<User> {
  //   const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
  //       .then(async (response) => {
  //           const userId = response.user.uid;
  //           const userDoc = await getDoc(doc(this.db, 'users', userId));
  
  //           if (userDoc.exists()) {
  //               const userData = userDoc.data();
  //               const user: User = {
  //                   email: userData["email"],
  //                   username: userData["username"],
  //                   role: {
  //                       roleId: userData["roleId"], 
  //                       roleName: userData["roleName"]
  //                   } as Roles
  //               };
  
  //               this.loggedIn.next(true);
  //               localStorage.setItem('isLoggedIn', 'true');

  //               alert("Uspješna prijava!");
  
                
  //               this.router.navigate(['/dashboard']); 
  //               return user;
  //           } else {
  //               throw new Error("User data not found");
  //           }
  //       })
  //       .catch((error) => {
  //           console.error('Login error:', error.message);
  //           throw error;
  //       });
  
  //   return from(promise);
  // }
  login(email: string, password: string): Observable<User> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(async (response) => {
        const userId = response.user.uid; 
        const userDoc = await getDoc(doc(this.db, 'users', userId));
  
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const user: User = {
            uid: userId, 
            email: userData["email"],
            username: userData["username"],
            role: {
              roleId: userData["roleId"],
              roleName: userData["roleName"] 
            } as Roles,
          };
          
          console.log('Current User:', user);
  
          this.loggedIn.next(true);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(user)); 
  
          alert("Uspješna prijava!");
          this.router.navigate(['/dashboard']);
          return user;
        } else {
          throw new Error("User data not found");
        }
      })
      .catch((error) => {
        console.error('Login error:', error.message);
        throw error;
      });
  
    return from(promise);
  }
  
  
  
  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth)
      .then(() => {
        this.loggedIn.next(false); 
        localStorage.removeItem('isLoggedIn'); 
        this.router.navigate(['/login']); 
      });
      
    return from(promise);
  }

  getCurrentUser() {
   
    return JSON.parse(localStorage.getItem('user') || '{}'); 
  }
}

