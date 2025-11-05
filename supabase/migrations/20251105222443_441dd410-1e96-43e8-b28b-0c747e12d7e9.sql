-- Criar usuário admin
-- Primeiro, criamos o usuário usando a função de administração do Supabase
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Inserir o usuário diretamente na tabela auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'sq1brunaleite@gmail.com',
    crypt('13467957', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Adicionar role de admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Criar identidade de email para o usuário
  INSERT INTO auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    new_user_id::text,
    new_user_id,
    format('{"sub":"%s","email":"sq1brunaleite@gmail.com"}', new_user_id::text)::jsonb,
    'email',
    now(),
    now(),
    now()
  );
END $$;