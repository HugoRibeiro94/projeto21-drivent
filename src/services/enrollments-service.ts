import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';
import { notFoundError, invalidCepError , requestError} from '@/errors';
import { addressRepository, CreateAddressParams, enrollmentRepository, CreateEnrollmentParams } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';

type AddressEnrollments = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type CEP = {
  cep: string;
};

// TODO - Receber o CEP por parâmetro nesta função.OK
async function getAddressFromCEP(cep:string): Promise<AddressEnrollments>  {
  // FIXME: está com CEP fixo! OK
  const result = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);

  // TODO: Tratar regras de negócio e lanças eventuais erros OK
  if (result.data.erro) throw invalidCepError(cep)
 
  // FIXME: não estamos interessados em todos os campos OK
  const address: AddressEnrollments = {
    logradouro: result.data.logradouro,
    complemento: result.data.complemento,
    bairro: result.data.bairro,
    cidade: result.data.localidade,
    uf:result.data.uf
  }
 
  return address;
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw notFoundError();

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  enrollment.birthday = new Date(enrollment.birthday);
  const address = getAddressForUpsert(params.address);

  // TODO - Verificar se o CEP é válido antes de associar ao enrollment.
  const result = await getAddressFromCEP(address.cep);
  if (!result) throw requestError(400,"cep invalido")

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

export const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};
