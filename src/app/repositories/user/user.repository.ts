import { Injectable } from '@nestjs/common';
import { UserModel } from '../../models/user/user.model';
import { PostgresRepository } from '../postgresBase.repository';
import {  DataSource } from 'typeorm';
// import { IPaginationDBParams } from '../../contracts/interfaces/paginationDBParams.interface';
// import { IPaginatedModelResponse } from '../../contracts/interfaces/paginatedModelResponse.interface';
// import { UserType } from '@/app/contracts/enums/usertype.enum';
// import { OwnerSearchQueryDto } from '@/owner/owner.dto';
// import { JwtPayload } from '@/app/contracts/types/jwtPayload.type';
// import { GetOwnerReportDto, GetVendorReportDto } from '@/report/report.dto';

@Injectable()
export class UserRepository extends PostgresRepository<UserModel> {
  constructor(dataSource: DataSource) {
    super(UserModel, dataSource);
  }

  // public async getVendors(
  //   params: IPaginationDBParams | null,
  //   service_type_id?: number,
  //   franchise_id?: number,
  //   is_approved?: boolean | undefined | null,
  //   name?: string | undefined | null,
  // ): Promise<IPaginatedModelResponse<UserModel>> {
  //   const queryBuilder = this.repository
  //     .createQueryBuilder('user')
  //     .where('user.user_type = :userType', { userType: UserType.Vendor })
  //     .innerJoinAndSelect('user.franchiseUser', 'franchise');

  //   // Join conditionally based on `service_type_id`
  //   if (service_type_id) {
  //     queryBuilder.innerJoinAndSelect(
  //       'user.vendorServiceType',
  //       'vendorServiceType',
  //       'vendorServiceType.service_type_id = :service_type_id',
  //       { service_type_id },
  //     );
  //   } else {
  //     queryBuilder.innerJoinAndSelect(
  //       'user.vendorServiceType',
  //       'vendorServiceType',
  //     );
  //   }

  //   // Always join `serviceType`
  //   queryBuilder.innerJoinAndSelect(
  //     'vendorServiceType.serviceType',
  //     'serviceType',
  //   );

  //   // Filter by franchise ID if provided
  //   if (franchise_id) {
  //     queryBuilder.andWhere('user.franchise_id = :franchise_id', {
  //       franchise_id,
  //     });
  //   }

  //   // Filter by name (case-insensitive match for first or last name)
  //   if (name) {
  //     queryBuilder.andWhere(
  //       '(user.first_name ILIKE :name OR user.last_name ILIKE :name)',
  //       {
  //         name: `%${name}%`,
  //       },
  //     );
  //   }

  //   // Filter by is_approved (validate boolean input)
  //   if (is_approved !== undefined && is_approved !== null) {
  //     queryBuilder.andWhere('user.is_approved = :is_approved', {
  //       is_approved,
  //     });
  //   }

  //   // Select only necessary fields
  //   queryBuilder.select([
  //     'user.id',
  //     'user.first_name',
  //     'user.last_name',
  //     'user.contact',
  //     'user.is_approved',
  //     'user.is_active',
  //     'vendorServiceType.id',
  //     'vendorServiceType.service_type_id',
  //     'vendorServiceType.franchise_id',
  //     'serviceType.id',
  //     'serviceType.title',
  //     'franchise.id',
  //     'franchise.name',
  //     'user.policy_number',
  //     'user.policy_expire_date',
  //   ]);

  //   if (params) queryBuilder.skip(params?.offset).take(params?.limit);

  //   // Execute the query with proper ordering
  //   const [data, count] = await queryBuilder
  //     .orderBy('user.id', 'DESC')
  //     .getManyAndCount();

  //   return { data, count };
  // }

  // async getVendor(vendorId: number): Promise<UserModel> {
  //   return await this.repository
  //     .createQueryBuilder('user')
  //     .leftJoinAndSelect('user.vendorServiceType', 'vendorServiceType')
  //     .leftJoinAndSelect('user.vendorUserLoc', 'vendorUserLoc')
  //     .leftJoinAndSelect(
  //       'vendorUserLoc.vendorServiceLocation',
  //       'vendorServiceLocation',
  //     )
  //     .leftJoinAndSelect('vendorServiceType.serviceType', 'serviceType')
  //     .leftJoinAndSelect(
  //       'serviceType.serviceTypeCategory',
  //       'serviceTypeCategory',
  //     )
  //     .where('user.id = :vendorId', { vendorId })
  //     .getOne();
  // }

  // public async getOwners(
  //   params: IPaginationDBParams,
  //   queryParams: OwnerSearchQueryDto,
  //   franchise_id?: number,
  //   startTime: number = 0,
  // ): Promise<IPaginatedModelResponse<UserModel>> {
  //   const queryBuilder = this.repository
  //     .createQueryBuilder('user')
  //     .where('user.user_type = :userType', { userType: UserType.Owner });

  //   if (franchise_id) {
  //     queryBuilder.andWhere('user.franchise_id = :franchise_id', {
  //       franchise_id,
  //     });
  //   }

  //   if (queryParams?.description) {
  //     queryBuilder.andWhere(
  //       '(LOWER(user.first_name) ILIKE LOWER(:description) OR LOWER(user.last_name) ILIKE LOWER(:description))',
  //       {
  //         description: `%${queryParams.description.toLowerCase()}%`,
  //       },
  //     );
  //   }

  //   if (queryParams.download) {
  //     queryBuilder.andWhere('user.created_at >= :startTime', {
  //       startTime,
  //     });
  //   } else {
  //     queryBuilder.skip(params.offset).take(params.limit);
  //   }

  //   queryBuilder
  //     .select([
  //       'user.id',
  //       'user.first_name',
  //       'user.last_name',
  //       'user.email',
  //       'user.cell_phone',
  //       'user.profile_completion_step',
  //       'user.franchise_id',
  //       'user.country',
  //       'user.city',
  //       'user.state',
  //       'user.zip',
  //       'user.mailing_address',
  //       'user.archived',
  //     ])
  //     .orderBy('user.id', 'DESC');

  //   const [data, count] = await queryBuilder.getManyAndCount();
  //   return { data, count };
  // }

  // async getStandardAdmins(
  //   params: IPaginationDBParams,
  //   franchise_id?: number,
  //   name?: string | undefined | null,
  // ): Promise<IPaginatedModelResponse<UserModel>> {
  //   const { offset, limit } = params;

  //   const queryBuilder = this.repository
  //     .createQueryBuilder('user')
  //     .skip(offset)
  //     .take(limit)
  //     .innerJoinAndSelect('user.userMenuItem', 'userMenuItem')
  //     .where('user.user_type = :userType', {
  //       userType: UserType.StandardAdmin,
  //       franchise_id,
  //       is_deleted: false,
  //     });

  //   if (name) {
  //     queryBuilder.andWhere(
  //       'user.first_name ILIKE :name OR user.last_name ILIKE :name',
  //       {
  //         name: `%${name}%`,
  //       },
  //     );
  //   }
  //   queryBuilder
  //     .select([
  //       'user.id',
  //       'user.first_name',
  //       'user.last_name',
  //       'user.email',
  //       'user.franchise_id',
  //       'userMenuItem.id',
  //       'userMenuItem.menu_item_permission',
  //       'userMenuItem.menu_item',
  //     ])
  //     .orderBy('user.id', 'DESC');
  //   const [data, count] = await queryBuilder.getManyAndCount();
  //   return { data, count };
  // }

  // async getOwnerById(ownerId: number, user: JwtPayload): Promise<UserModel> {
  //   return await this.repository
  //     .createQueryBuilder('user')
  //     .leftJoinAndSelect('user.userPaymentMethod', 'userPaymentMethod')
  //     .leftJoinAndMapOne(
  //       'user.propertyMaster',
  //       'user.propertyMaster',
  //       'propertyMaster',
  //       'propertyMaster.owner_id = user.id',
  //     )
  //     .where('user.id = :ownerId', { ownerId })
  //     .andWhere('user.franchise_id = :franchiseId', {
  //       franchiseId: Number(user.franchise_id),
  //     })
  //     .select([
  //       'user.id',
  //       'user.first_name',
  //       'user.last_name',
  //       'user.email',
  //       'user.contact',
  //       'user.user_type',
  //       'user.mailing_address',
  //       'user.profile_completion_step',
  //       'user.franchise_id',
  //       'user.state',
  //       'user.zip',
  //       'user.city',
  //       'user.terms_and_conditions',
  //       'userPaymentMethod',
  //       'propertyMaster',
  //     ])
  //     .orderBy('user.id', 'DESC')
  //     .getOne();
  // }

  // public async getVendorReport(
  //   query: GetVendorReportDto,
  //   user: JwtPayload,
  //   pagination: IPaginationDBParams,
  //   startTime: number = 0,
  // ) {
  //   const queryBuilder = this.repository
  //     .createQueryBuilder()
  //     .select([
  //       'users.id',
  //       'users.first_name', // Business Name
  //       'users.last_name', // Business Name
  //       'users.contact', // Contact
  //       'users.cell_phone', // Mobile Phone
  //       'users.office_phone', // Office Phone
  //       'users.email', // Email
  //       'users.mailing_address', // Mailing Address
  //       'users.city', // City
  //       'users.state', // State
  //       'users.zip', // Zip Code
  //       'users.is_active', // Status
  //       'users.created_at', // Date Joined
  //       'users.policy_expire_date', // Insurance Expiration Date
  //       'vendor_locations.id',
  //       'service_locations.id',
  //       'service_locations.service_area', // Service Area
  //     ])
  //     .leftJoin('users.vendorUserLoc', 'vendor_locations')
  //     .leftJoin('vendor_locations.vendorServiceLocation', 'service_locations')
  //     .where('users.user_type = :userType', { userType: UserType.Vendor })
  //     .andWhere('users.franchise_id = :franchiseId', {
  //       franchiseId: user.franchise_id,
  //     });

  //   // Apply filters
  //   if (query.search) {
  //     queryBuilder.andWhere(
  //       new Brackets((builder) => {
  //         builder
  //           .where('users.first_name ILIKE :search', {
  //             search: `%${query.search}%`,
  //           })
  //           .orWhere('users.last_name ILIKE :search', {
  //             search: `%${query.search}%`,
  //           })
  //           .orWhere('users.email ILIKE :search', {
  //             search: `%${query.search}%`,
  //           })
  //           .orWhere('users.contact ILIKE :search', {
  //             search: `%${query.search}%`,
  //           });
  //       }),
  //     );
  //   }

  //   if (query.vendor_status) {
  //     queryBuilder.andWhere('users.is_active = :vendorStatus', {
  //       vendorStatus: query.vendor_status,
  //     });
  //   }

  //   if (query.service_area) {
  //     queryBuilder.andWhere(
  //       'service_locations.service_area ILIKE :serviceArea',
  //       {
  //         serviceArea: `%${query.service_area}%`,
  //       },
  //     );
  //   }

  //   if (query.download)
  //     queryBuilder.andWhere('users.created_at >= :startTime', {
  //       startTime,
  //     });
  //   else queryBuilder.skip(pagination.offset).take(pagination.limit);

  //   queryBuilder.orderBy('users.created_at', 'DESC');

  //   const [data, count] = await queryBuilder.getManyAndCount();

  //   return { data, count };
  // }

  // public async getOwnerReport(
  //   query: GetOwnerReportDto,
  //   user: JwtPayload,
  //   pagination: IPaginationDBParams,
  //   startTime: number = 0,
  // ) {
  //   const queryBuilder = this.repository
  //     .createQueryBuilder()
  //     .select([
  //       'users.id',
  //       'users.first_name', // First Name
  //       'users.last_name', // Last Name
  //       'users.email', // Email
  //       'users.cell_phone', // Phone #
  //       'users.mailing_address', // Mailing Address
  //       'users.created_at', // Date Joined
  //       'users.contact', // Secondary Contact Name
  //       'users.office_phone', // Secondary Contact Phone
  //       'property.id',
  //       'property.alternate_contact_name',
  //       'property.alternate_contact_phone',
  //       'membership_tier.id',
  //       'membership_tier.membership_type', // Membership Type
  //     ])
  //     .leftJoin('users.propertyMaster', 'property')
  //     .leftJoin('property.membershipTier', 'membership_tier')
  //     .where('users.user_type = :userType', { userType: UserType.Owner })
  //     .andWhere('users.franchise_id = :franchiseId', {
  //       franchiseId: user.franchise_id,
  //     });

  //   // Apply filters
  //   if (query.search) {
  //     queryBuilder.andWhere(
  //       new Brackets((builder) => {
  //         builder
  //           .where('users.first_name ILIKE :search', {
  //             search: `%${query.search}%`,
  //           })
  //           .orWhere('users.last_name ILIKE :search', {
  //             search: `%${query.search}%`,
  //           })
  //           .orWhere('users.email ILIKE :search', {
  //             search: `%${query.search}%`,
  //           })
  //           .orWhere('users.contact ILIKE :search', {
  //             search: `%${query.search}%`,
  //           });
  //       }),
  //     );
  //   }

  //   if (query.is_active !== undefined) {
  //     queryBuilder.andWhere('users.is_active = :isActive', {
  //       isActive: query.is_active,
  //     });
  //   }

  //   if (query.membership_type !== undefined) {
  //     queryBuilder.andWhere(
  //       'membership_tier.membership_type = :membershipStatus',
  //       {
  //         membershipStatus: query.membership_type,
  //       },
  //     );
  //   }

  //   if (query.download) {
  //     queryBuilder.andWhere('users.created_at >= :startTime', {
  //       startTime,
  //     });
  //   } else queryBuilder.skip(pagination.offset).take(pagination.limit);

  //   queryBuilder.orderBy('users.created_at', 'DESC');

  //   const [data, count] = await queryBuilder.getManyAndCount();

  //   return { data, count };
  // }

  // async getAllVendors(user: JwtPayload): Promise<UserModel[]> {
  //   const queryBuilder = this.repository
  //     .createQueryBuilder('user')
  //     .where('user.user_type = :userType', { userType: UserType.Vendor })
  //     .andWhere('user.is_active = :isActive', { isActive: true })
  //     .andWhere('user.is_deleted = :isDeleted', { isDeleted: false })
  //     .andWhere('user.is_approved = :isApproved', { isApproved: true })
  //     .andWhere('user.franchise_id = :franchiseId', {
  //       franchiseId: Number(user.franchise_id),
  //     })
  //     .select(['user.id', 'user.first_name', 'user.last_name'])
  //     .orderBy('user.id', 'DESC');

  //   return await queryBuilder.getMany();
  // }
}
