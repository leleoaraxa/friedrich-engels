import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import z from 'zod'

import { signUp } from '../../api/sign-up'
import { uploadAttachments } from '../../api/upload-attachments'
import accessIcon from '../../assets/icons/access.svg'
import arrowRightIconOrange from '../../assets/icons/arrow-right-orange.svg'
import arrowRightIconWhite from '../../assets/icons/arrow-right-white.svg'
import callIcon from '../../assets/icons/call.svg'
import mailIcon from '../../assets/icons/mail.svg'
import userIcon from '../../assets/icons/user.svg'
import { FieldErrorMessage } from '../../components/fieldErrorMessage'
import { ImageUpload } from '../../components/imageUpload'
import { InputWithIcon } from '../../components/inputWithIcon'
import { Label } from '../../components/label'

const ACCEPTED_IMAGE_TYPES = ['image/png']

const phoneRegex = /^\d{10,11}$/ // Entre 10 e 11 dígitos

const signUpFormSchema = z
  .object({
    avatar: z
      .custom<FileList>()
      .refine((files) => files && files.length > 0, {
        message: 'A imagem é obrigatória',
      })
      .refine(
        (files) => {
          return Array.from(files ?? []).every((file) =>
            ACCEPTED_IMAGE_TYPES.includes(file.type),
          )
        },
        {
          message: 'A imagem precisa ser do tipo PNG',
        },
      ),

    fullName: z.string().min(3, 'Informe seu nome completo'),

    phone: z.string().regex(phoneRegex, 'Telefone inválido'),

    email: z.string().email('E-mail inválido'),

    password: z.string().min(3, 'A senha deve ter pelo menos 3 caracteres'),

    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'As senhas não coincidem',
  })

type SignUpForm = z.infer<typeof signUpFormSchema>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpForm>({ resolver: zodResolver(signUpFormSchema) })

  const { mutateAsync: uploadAvatar } = useMutation({
    mutationFn: uploadAttachments,
  })

  const { mutateAsync: signUpFn } = useMutation({
    mutationFn: signUp,
  })

  async function handleSignUp(data: SignUpForm) {
    try {
      let attachmentId = null

      if (data.avatar?.length) {
        const files = new FormData()
        files.append('files', data.avatar[0])

        const uploadedAvatar = await uploadAvatar({ files })

        attachmentId = uploadedAvatar?.attachments[0]?.id

        if (!attachmentId) throw new Error()
      }

      await signUpFn({
        name: data.fullName,
        phone: data.phone,
        email: data.email,
        avatarId: attachmentId,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      })

      toast.success('Cadastro realizado com sucesso!', {
        action: {
          label: 'Login',
          onClick: () => navigate(`/sign-in?email=${data.email}`),
        },
      })
    } catch (error) {
      toast.error('Erro ao cadastrar.')
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />

      <div className="scrollbar flex h-full w-full flex-col gap-20 overflow-y-scroll rounded-[32px] bg-[var(--white)] px-20 py-[4.5rem]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 ">
            <h2 className="title-md text-[var(--gray-500)]">Crie sua conta</h2>
            <p className="body-sm">Informe seus dados pessoais e de acesso </p>
          </div>

          <form className="space-y-12" onSubmit={handleSubmit(handleSignUp)}>
            <div className="space-y-5">
              <h3 className="title-sm text-[var(--gray-500)]">Perfil</h3>

              <div>
                <div className="h-[120px] w-[120px] ">
                  <ImageUpload
                    id="avatar"
                    accept=".png"
                    register={register('avatar')}
                  />
                </div>

                {errors.avatar && (
                  <FieldErrorMessage message={errors.avatar.message} />
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="fullName">Nome</Label>
                <InputWithIcon
                  icon={userIcon}
                  id="fullName"
                  placeholder="Seu nome completo"
                  {...register('fullName')}
                />

                {errors.fullName && (
                  <FieldErrorMessage message={errors.fullName.message} />
                )}
              </div>

              <div className="flex flex-col">
                <Label htmlFor="phone">Telefone</Label>
                <InputWithIcon
                  icon={callIcon}
                  id="phone"
                  placeholder="(00) 00000-0000"
                  {...register('phone')}
                />

                {errors.phone && (
                  <FieldErrorMessage message={errors.phone.message} />
                )}
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="title-sm text-[var(--gray-500)]">Acesso</h3>

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

              <div className="flex flex-col">
                <Label htmlFor="passwordConfirmation">Confirmar senha</Label>
                <InputWithIcon
                  icon={accessIcon}
                  id="passwordConfirmation"
                  placeholder="Confirme a senha"
                  type="password"
                  {...register('passwordConfirmation')}
                />

                {errors.passwordConfirmation && (
                  <FieldErrorMessage
                    message={errors.passwordConfirmation.message}
                  />
                )}
              </div>
            </div>

            <button
              className={`mt-12 flex h-14 w-full items-center justify-between rounded-[.625rem] bg-[var(--orange-base)] px-5 text-[var(--white)] transition-colors duration-200
              ${isSubmitting ? 'cursor-not-allowed opacity-55' : 'hover:bg-[var(--orange-dark)]'}`}
              disabled={isSubmitting}
              type="submit"
            >
              <span className="action-md">Cadastrar</span>
              <img
                src={arrowRightIconWhite}
                className="h-6 w-6"
                alt="Seta para a direita"
              />
            </button>
          </form>
        </div>

        <div className="mt-auto space-y-5">
          <p className="body-md text-[var(--gray-300)]">Já tem uma conta?</p>

          <div>
            <Link to="/sign-in">
              <button
                className={`flex h-14 w-full items-center justify-between rounded-[.625rem] border-[1px] border-[var(--orange-base)] px-5 text-[var(--orange-base)] transition-colors duration-200                            
                ${isSubmitting ? 'cursor-not-allowed opacity-55' : 'hover:border-[var(--orange-dark)] hover:text-[var(--orange-dark)]'}`}
                disabled={isSubmitting}
              >
                <span className="action-md">Acessar</span>
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
    </>
  )
}
