import AuthForm from './AuthForm';

const LoginPage = () => {
    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="p-5 shadow rounded">
                <AuthForm type="login" onSubmit={handleLogin} />
            </div>
        </div>
    );
};

export default LoginPage;
