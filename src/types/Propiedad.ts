//export interface Propiedad {
//    id: string;
//    title: string;
//    img: string;
//    details: string[];
//    servicios: string[];
//    price: number;
//}

// Define el tipo para el objeto Servicio
export interface Servicio {
    id: number;
    nombre: string;
    costo: number;
}

// Define el tipo para la Propiedad (basado en la API)
export interface Propiedad {
    id: number;
    titulo: string;
    descripcion: string;
    direccion: string;
    precioPorNoche: number;
    numeroHuespedes: number;
    imagenPrincipalUrl: string;
    servicios: Servicio[]; // Ahora es un array de objetos Servicio
}