pnpm install --frozen-lockfile
pnpm build
sed -i 's#const config_1 = __importDefault(require("../config"));#const config_1 = __importDefault(require("config"));#' dist/src/app.js 
sed -i 's#const config_1 = __importDefault(require("../../config"));#const config_1 = __importDefault(require("config"));#' dist/src/utils/connectToDB.js 
sed -i 's#const config_1 = __importDefault(require("../../config"));#const config_1 = __importDefault(require("config"));#' dist/src/utils/jwt.js 
sed -i 's#const config_1 = __importDefault(require("../../config"));#const config_1 = __importDefault(require("config"));#' dist/src/utils/logger.js 
sed -i 's#const config_1 = __importDefault(require("../../config"));#const config_1 = __importDefault(require("config"));#' dist/src/utils/mailer.js 
pnpm start