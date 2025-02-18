import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse): void {
    let message = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      message = error.error.message;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          message = 'Requête invalide';
          break;
        case 401:
          message = 'Non autorisé';
          break;
        case 403:
          message = 'Accès refusé';
          break;
        case 404:
          message = 'Ressource non trouvée';
          break;
        case 500:
          message = 'Erreur serveur';
          break;
      }
    }

    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}