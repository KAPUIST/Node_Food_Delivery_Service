export class AuthService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    // 회원가입 - service
    signUpUser = async ({ email, password, role, city, name, phoneNumber }) => {
        const condition = { email, password, role, city, name, phoneNumber };
        console.log(condition.email);

        const existUser = await this.usersRepository.findUser({ email });
    };
}
