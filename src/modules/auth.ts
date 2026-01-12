import { SignJWT } from 'jose'
import { env } from '../env'

/*
  - Chave simétrica => a mesma chave que cria os tokens também valida os tokens
  - Chave assimétrica => uma chave para criar tokens, que fica apenas dentro dos serviços
  que criam/recebem novos logins e pode ter várias outras chaves públicas que estão nos
  outros serviços que servem para validar que o token de login é real/válido
*/

export async function authenticateUser(userId: string) {
	const secret = new TextEncoder().encode(env.JWT_SECRET)

	const token = await new SignJWT()
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject(userId)
		.setExpirationTime('1d')
		.setIssuedAt()
		.sign(secret)

	return token
}
