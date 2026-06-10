using System.Security.Cryptography;
using System.Text;

namespace SmartSurveyBuilder.Server.Modules.AuthModule.Services
{
    public class PasswordService
    {
        private const int SaltSize = 16;
        private const int KeySize = 32;
        private const int Iterations = 10000;

        public string HashPassword(string password)
        {
            using (var algorithm = new Rfc2898DeriveBytes(password, SaltSize, Iterations, HashAlgorithmName.SHA256))
            {
                var salt = algorithm.Salt;
                var key = algorithm.GetBytes(KeySize);

                var saltAndKey = new byte[SaltSize + KeySize];
                Array.Copy(salt, 0, saltAndKey, 0, SaltSize);
                Array.Copy(key, 0, saltAndKey, SaltSize, KeySize);

                return Convert.ToBase64String(saltAndKey);
            }
        }

        public bool VerifyPassword(string password, string hash)
        {
            try
            {
                var saltAndKey = Convert.FromBase64String(hash);
                var salt = new byte[SaltSize];
                Array.Copy(saltAndKey, 0, salt, 0, SaltSize);

                using (var algorithm = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256))
                {
                    var key = algorithm.GetBytes(KeySize);
                    var storedKey = new byte[KeySize];
                    Array.Copy(saltAndKey, SaltSize, storedKey, 0, KeySize);
                    return CryptographicOperations.FixedTimeEquals(key, storedKey);
                }
            }
            catch
            {
                return false;
            }
        }

        public bool IsStrongPassword(string password)
        {
            return !string.IsNullOrEmpty(password) &&
                   password.Length >= 8 &&
                   password.Any(char.IsUpper) &&
                   password.Any(char.IsLower) &&
                   password.Any(char.IsDigit) &&
                   password.Any(c => !char.IsLetterOrDigit(c));
        }
    }
}
