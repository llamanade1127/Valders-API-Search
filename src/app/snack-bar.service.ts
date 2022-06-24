import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  error(err: string) {
    this.snackBar.open(err, 'OK', {
      duration: 5000,
    });
  }

  authError() {
    this.snackBar.open('You must be logged in!', 'OK', {
      duration: 5000
    });

    // @ts-ignore
    return this.snackBar._openedSnackBarRef
      .onAction()
      .pipe(tap(_ => this.router.navigate(['/login'])))
      .subscribe();
  }
}
