/**************************** PERSONNEL ***********************************/
export const POST_PERSONNEL = '/api/v1/personnels';
export const PATCH_PERSONNEL = '/api/v1/personnels';
export const DELETE_PERSONNEL = '/api/v1/personnels/';
export const GET_PERSONNEL_BY_ID = '/api/v1/personnels/';
export const GET_ALL_PERSONNEL = '/api/v1/personnels';

/**************************** STUDENTS ***********************************/
export const POST_STUDENT = '/api/v1/students';
export const GET_ALL_STUDENTS = '/api/v1/students';
export const DELETE_STUDENT = '/api/v1/students/';
export const GET_STUDENT_BY_ID = '/api/v1/students/';
export const PATCH_STUDENT = '/api/v1/students';
export const PATCH_STUDENT_PAIEMENT = '/api/v1/students/paiements';
export const DELETE_STUDENT_PAIEMENT = '/api/v1/students/paiements';


/**************************** SCHEDULE ***********************************/
export const POST_SCHEDULE = '/api/v1/schedules';
export const GET_ALL_SCHEDULE = '/api/v1/schedules';
export const DELETE_SCHEDULE = '/api/v1/schedules/';
export const GET_SCHEDULE_BY_ID = '/api/v1/schedules/';
export const PATCH_SCHEDULE = '/api/v1/schedules';

/**************************** PAIEMENT ***********************************/
export const POST_PAIEMENT = '/api/v1/paiements';
export const GET_ALL_PAIEMENT = '/api/v1/paiements';
export const POST_SALARY = '/api/v1/paiements/salary';
export const GET_ALL_SALARIES = '/api/v1/paiements/salary';
export const DELETE_SALARY = '/api/v1/paiements/salary/';
export const PATCH_SALARY = '/api/v1/paiements/salary';
export const GET_SALARY_BY_ID = '/api/v1/paiements/salary/';

export const GET_SOLDE = '/api/v1/paiements/solde';
export const GET_SOLDE_BEFORE = '/api/v1/paiements/soldebefore';
export const GET_DEPENSES = '/api/v1/paiements/depenses';
export const GET_ALL_DEPENSES = '/api/v1/paiements/alldepenses';
export const GET_RECETTE = '/api/v1/paiements/recette';
export const GET_ALL_RECETTE = '/api/v1/paiements/allrecette';

/**************************** BULLETIN ***********************************/
export const POST_BULLETIN = '/api/v1/bulletins';
export const GET_ALL_BULLETIN = '/api/v1/bulletins';
export const DELETE_BULLETIN = '/api/v1/bulletins/';
export const GET_BULLETIN_BY_ID = '/api/v1/bulletins/';
export const GET_BULLETIN_BY_IDELEVE = '/api/v1/bulletins/eleve/';
export const GET_BULLETIN_GENERATE_PDF = '/api/v1/bulletins/generate-pdf/';
export const PATCH_BULLETIN = '/api/v1/bulletins';

/**************************** NOTIFICATION ***********************************/
export const POST_NOTIFICATION = '/api/v1/notifications';
export const GET_ALL_NOTIFICATIONS = '/api/v1/notifications';
export const DELETE_NOTIFICATION = '/api/v1/notifications/';

/**************************** METRICS ***********************************/
export const GET_METRICS = '/api/v1/metrics';