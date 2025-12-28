// import {  JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";


// export const GenerateToken = async ({ payload, secret, options }: {
//   payload: Object,
//   secret: string,
//   options?: SignOptions

// }): Promise<string>=> {

// return sign(payload, secret, options);
// }

// export const VerifyToken = async ({ token, secret }: {
//   token: string,
//   secret: string
// }): Promise<JwtPayload> => {
//   return verify(token, secret) as JwtPayload;
// };



// export enum TokenType {
//   access = "access",
//   refresh = "refresh",
// }



// //&^ Generate signature based on token type and prefix
// export const GenerateSignature = async (tokenType: TokenType, prefix: string) => {
//   //&* tokenType: access
//   if (tokenType === TokenType.access) {
//     if (prefix === process.env.BEARER_USER) {
//       return process.env.SIGNATURE_USER_TOKEN
//     } else if (prefix === process.env.BEARER_ADMIN) {
//       return process.env.SIGNATURE_ADMIN_TOKEN
//     } else {
//       return null
//     }
//   }
//   //&* tokenType: refresh
//   if (tokenType === TokenType.refresh) {
//     if (prefix === process.env.BEARER_USER) {
//       return process.env.REFRESH_SIGNATURE_USER_TOKEN
//     } else if (prefix === process.env.BEARER_ADMIN) {
//       return process.env.REFRESH_SIGNATURE_ADMIN_TOKEN
//     } else {
//       return null
//     }
//   }

//   //&* Finally: if no condition matches:
//   return null

// }

// //&^ Decode token and fetch user:
// export const decodedTokenAndFetchUser = async (token: string, signature: string) => {
//   const decoded = await VerifyToken({ token, signature });
//   if (!decoded) {
//     throw new AppError("Invalid Token", 400);
//   }
//   //* fetch user from DB:
//   const user = await _userModel.findOne({ email: decoded.email });
//   if (!user) {
//     throw new AppError("Email does not exist", 409);
//   }

//   if (!user?.confirmed || user.deletedAt) {
//     throw new AppError("Please confirm the email or you are freezed", 400);
//   }
//   //* check if token is revoked:

//   if (await _revokeToken.findOne({ tokenId: decoded?.jti! })) {
//     throw new AppError("Token has been revoked from current device , Please login again", 401);
//   }


//   //* check if user changed his credentials after the token was issued:
//   //(decoded?.iat! * 1000) to change it to milliseconds
//   if (user?.changeCredentials?.getTime()! > (decoded?.iat! * 1000)) {
//     throw new AppError("changeCredentials has been happedned or Token has been revoked from all devices , Please login again", 401);
//   }

  

//   //& Get user and decoded:
//   return { user, decoded };

// }

