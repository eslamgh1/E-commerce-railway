//  import * as z  from "zod";


//  export const userSchema = z.object({
//     name: z.string().min(3).max(255),
//     age: z.number().min(18).max(120),
//     password: z.string().min(6).max(255),
//     cPassword: z.string().min(6).max(255),
//  }).superRefine((data, ctx) => {
//     if(data.password !== data.cPassword){
//         ctx.addIssue({
//             code: "custom",
//             path: ["cPassword"],
//             message: "Password do not match"
//         })
//     }
//  })