import fs from 'fs';

class Witcher {
  public static JWT_PRIVATE_KEY : string;
  public static JWT_PUBLIC_KEY : string;

  static {
    Witcher.JWT_PRIVATE_KEY = fs.readFileSync('./resources/jwt/jwtRS256.key').toString();

    Witcher.JWT_PUBLIC_KEY = fs.readFileSync('./resources/jwt/jwtRS256.key.pub').toString();
  }
}

export default Witcher;