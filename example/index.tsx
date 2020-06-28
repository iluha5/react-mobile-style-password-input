import * as ReactDOM from 'react-dom';
import * as React from 'react';
import InputPassword from '../lib'

const ExampleForm: React.FC = () => {
  const [password, setPassword] = React.useState<string>('');
  const [isPasswordVisible, setPasswordVisible] = React.useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(password);
  }
  const handlePasswordChange = (value: string) => setPassword(value);
  const handlePasswordVisibleClick = () => setPasswordVisible(!isPasswordVisible);

  return (
    <form onSubmit={handleSubmit}>
        <InputPassword
            placeholder='Input password'
            onPasswordChange={handlePasswordChange}
            name='password'
            type={isPasswordVisible ? 'text' : 'password'}
        />
        <button type='button' onClick={handlePasswordVisibleClick}>
            {isPasswordVisible ? 'Hide' : 'Show'}
        </button>
        <button type='submit'>Submit</button>
    </form>
  );
};

ReactDOM.render(
    <ExampleForm />,
    document.getElementById('root')
);

