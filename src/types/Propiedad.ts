// Define el tipo para el objeto Servicio
export interface Servicio {
    id: number;
    nombre: string;
    costo: number;
}

// Define el tipo para la Propiedad
export interface Propiedad {
    id: number;
    titulo: string;
    descripcion: string;
    direccion: string;
    precioPorNoche: number;
    numeroHuespedes: number;
    imagenPrincipalUrl: string;
    servicios: Servicio[];
}