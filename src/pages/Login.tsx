import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

const Login = () => {
    return (
        <main className="auth-page">
            <section className="auth-panel">
                <div className="auth-brand">
                    <span className="brand-mark" aria-hidden="true">IS</span>
                    <span>InvenStoree</span>
                </div>
                <h1>Welcome back</h1>
                <p className="auth-subtitle">Sign in or create your account to continue.</p>
                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#315EFB',
                                    brandAccent: '#2448CF',
                                },
                                borderWidths: {
                                    buttonBorderWidth: '1px',
                                    inputBorderWidth: '1px',
                                },
                                radii: {
                                    borderRadiusButton: '8px',
                                    inputBorderRadius: '8px',
                                },
                            }
                        }
                    }}
                    providers={[]}
                />
            </section>
        </main>
        
    )
}

export default Login