import { IPaginationDBParams } from '../contracts/interfaces/paginationDBParams.interface';
import { IPaginationRequestParams } from '../contracts/interfaces/paginationRequestParams.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneralHelper {
  constructor(private configService: ConfigService) {}

  getPaginationOptions(params: IPaginationRequestParams): IPaginationDBParams {
    const pageLimit = this.configService.get('PAGE_LIMIT');
    const options: IPaginationDBParams = {
      limit: pageLimit ? parseInt(pageLimit) : 10,
      offset: 0,
    };

    const limit = params.limit;
    const page = params.page || 1;

    if (limit) {
      options.limit = parseInt(limit.toString());
    }

    if (page) {
      options.offset = options.limit * Math.max(page - 1, 0);
    }
    return options;
  }

  getPaginationOptionsV2(
    params: IPaginationRequestParams,
  ): IPaginationDBParams {
    const pageLimit = this.configService.get('PAGE_LIMIT');
    const defaultLimit = pageLimit ? parseInt(pageLimit) : 10;

    const limit =
      params.limit &&
      Number.isInteger(Number(params.limit)) &&
      Number(params.limit) > 0
        ? parseInt(params.limit.toString())
        : defaultLimit;

    const page =
      params.page &&
      Number.isInteger(Number(params.page)) &&
      Number(params.page) > 0
        ? parseInt(params.page.toString())
        : 1;

    return {
      limit: params?.return_till_current_page ? limit * page : limit,
      offset: params?.return_till_current_page ? 0 : limit * (page - 1),
    };
  }

  generateCsv(headers: string[], rows: any[]) {
    const csv = [headers.join(',')];

    rows.forEach((row) => {
      csv.push(row.join(','));
    });

    return csv.join('\n');
  }

  checkStripeKeyMode(publicKey: string, secretKey: string) {
    const isProdEnv = this.configService.get('NODE_ENV') === 'production';

    if (
      (secretKey.startsWith('sk_live_') &&
        publicKey.startsWith('pk_live_') &&
        isProdEnv) ||
      (secretKey.startsWith('sk_test_') &&
        publicKey.startsWith('pk_test_') &&
        !isProdEnv)
    )
      return true;

    return false;
  }

  getDownloadableCsvCutoffTime() {
    return Math.round(
      new Date(
        new Date().setDate(
          new Date().getDate() -
            Number(this.configService.get('MAX_AGE_REPORT_RECORDS_IN_DAYS')),
        ),
      ).getTime() / 1000,
    );
  }
}
