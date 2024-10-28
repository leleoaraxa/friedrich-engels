import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import z from 'zod'

import { signIn } from '../../api/sign-in'
import accessIcon from '../../assets/icons/access.svg'
import arrowRightIconOrange from '../../assets/icons/arrow-right-orange.svg'
import arrowRightIconWhite from '../../assets/icons/arrow-right-white.svg'
import mailIcon from '../../assets/icons/mail.svg'
import { FieldErrorMessage } from '../../components/fieldErrorMessage'
import { InputWithIcon } from '../../components/inputWithIcon'
import { Label } from '../../components/label'

const signInFormSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

type SignInForm = z.infer<typeof signInFormSchema>

export function SignIn() {
  const [searchParams] = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  const navigate = useNavigate()

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn(data: SignInForm) {
    try {
      await authenticate({ email: data.email, password: data.password })

      navigate('/')
    } catch (error) {
      toast.error('Credenciais inválidas.')
    }
  }

  return (
    <>
      <Helmet title="Login" />

      <div className="h-full w-full rounded-[32px] bg-[var(--white)] px-20 py-[4.5rem]">
        <div className="flex h-full flex-col gap-12">
          <div className="flex flex-col gap-2 ">
            <h2 className="title-md text-[var(--gray-500)]">
              Acesse sua conta
            </h2>
            <p className="body-sm">Informe seu e-mail e senha para entrar</p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(handleSignIn)}
          >
            <div className="flex flex-col">
              <Label htmlFor="email">E-mail</Label>
              <InputWithIcon
                icon={mailIcon}
                id="email"
                placeholder="Seu e-mail cadastrado"
                {...register('email')}
              />

              {errors.email && (
                <FieldErrorMessage message={errors.email.message} />
              )}
            </div>

            <div className="flex flex-col">
              <Label htmlFor="password">Senha</Label>
              <InputWithIcon
                icon={accessIcon}
                id="password"
                placeholder="Sua senha de acesso"
                type="password"
                {...register('password')}
              />

              {errors.password && (
                <FieldErrorMessage message={errors.password.message} />
              )}
            </div>

            <button
              className={`mt-12 flex h-14 w-full items-center justify-between rounded-[.625rem] bg-[var(--orange-base)] px-5 text-[var(--white)] transition-colors duration-200
              ${isSubmitting ? 'cursor-not-allowed opacity-55' : 'hover:bg-[var(--orange-dark)]'}`}
              disabled={isSubmitting}
              type="submit"
            >
              <span className="action-md">Acessar</span>
              <img
                src={arrowRightIconWhite}
                className="h-6 w-6"
                alt="Seta para a direita"
              />
            </button>
          </form>

          <div className="mt-auto space-y-5">
            <p className="body-md text-[var(--gray-300)]">
              Ainda não tem uma conta?
            </p>

            <div>
              <Link to="/sign-up">
                <button
                  className={`flex h-14 w-full items-center justify-between rounded-[.625rem] border-[1px] border-[var(--orange-base)] px-5 text-[var(--orange-base)] transition-colors duration-200                            
                ${isSubmitting ? 'cursor-not-allowed opacity-55' : 'hover:border-[var(--orange-dark)] hover:text-[var(--orange-dark)]'}`}
                  disabled={isSubmitting}
                >
                  <span className="action-md">Cadastrar</span>
                  <img
                    src={arrowRightIconOrange}
                    className="h-6 w-6"
                    alt="Seta para a direita"
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
