import * as monitoreo from './APIs/Monitoreo';
import * as kill from './APIs/Kill';
import * as ips from './APIs/Ips';
import * as historico from './APIs/Historico';

export default{
    ...monitoreo
    ,...kill
    ,...ips
    ,...historico
}