export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type FileRequest<T> = { [K in keyof T]: Express.Multer.File[] }
export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
export type WithNonNullable<T, K extends keyof T> = T & { [P in K]-?: NonNullable<T[P]> };

export enum NotificationSeverity {
    ERROR = 'Erreur',
    SUCCESS = 'Succès',
    WARNING = 'Alerte',
    INFORMATION = 'Information'
}

export interface NotificationContent {
    severity: NotificationSeverity
    message: string
}