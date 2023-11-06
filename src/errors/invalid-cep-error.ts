import { ApplicationError } from '@/protocols';

export function invalidCepError(cep:string):ApplicationCepError {
    return{
        name: 'InvalidCepError',
        cep: cep,
        message: `"${cep}" is not a valid cep!`,
    }
}

export type ApplicationCepError = ApplicationError & { cep: string };