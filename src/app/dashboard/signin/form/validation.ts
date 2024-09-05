import {z} from "zod"

export const formSchema = z.object({
    email: z.string({required_error: 'Email harus diIsi'}).email({message: 'Email tidak valid'}),
    password: z.string({required_error: 'password harus diIsi'}).min(5, {message: 'password harus memiliki minimal 5 karakter'})
})