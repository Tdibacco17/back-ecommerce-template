//respuesta Api
export interface ParseResponseInterface {
    message: string,
    status: number,
    data?: any,
}
//respuesta login api
export interface AuthResponseInterface extends ParseResponseInterface {
    role?: string,
    token?: string
}
//respuesta mp api
export interface MercadoPagoResponseInterface extends ParseResponseInterface {
    url: string,
}