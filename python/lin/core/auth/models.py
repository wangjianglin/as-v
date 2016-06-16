from django.db import models


class Permission(models.Model):
    desc = models.CharField(db_column="permission_desc", max_length=255)
    url = models.CharField(db_column="url_str", max_length=255)

    class Meta:
        db_table = 'asv_user_permission'
    # roles = models.ManyToManyRel("permissions",Role)
#
# class RolePermissInfo(models.Model):
#     startDate = models.DateTimeField("state_date", null=True)
#     endDate = models.DateTimeField("end_data", null=True)
#
#     class Meta:
#         db_table = 'asv_user_role_permiss_info'


class Role(models.Model):
    name = models.CharField(db_column="role_name", max_length=64)
    desc = models.CharField(db_column="role_desc", max_length=255)
    # permissions = models.ManyToManyField(RoleInfo)

    class Meta:
        db_table = 'asv_user_role'


# class UserAuthInfo(models.Model):
#     roles = models.ForeignKey(UserRoleInfo, related_name="user_id")
#     permiss = models.ForeignKey(UserPermissInfo, related_name="user_di")
#
#     class Meta:
#         db_table = 'asv_user_auth_info'


class UserBaseInfo(models.Model):
    # ad = models.CharField(db_column="ad")
    parcent = models.FloatField(db_column="parcent", default=0.7)

    class Meta:
        db_table = 'asv_user_base_info'

class User(models.Model):
    username = models.CharField(db_column="user_name", max_length=64)
    nickname = models.CharField(db_column="nick_name", max_length=64)
    password = models.CharField(db_column="password", max_length=64)
    isDelete = models.BooleanField(db_column="is_delete", default=False)
    # info = models.OneToOneField(UserBaseInfo, on_delete=True, to_field="base_info_id")
    # auth = models.OneToOneField(UserAuthInfo, on_delete=True)

    class Meta:
        db_table = 'asv_user'

class UserPermissInfo(models.Model):
    startDate = models.DateTimeField(db_column="state_date", null=True)
    endDate = models.DateTimeField(db_column="end_data", null=True)
    desc = models.CharField(db_column="desc", max_length=255)

    permisses = models.ForeignKey(Role, related_name="permiss_id")
    users = models.ForeignKey(User, related_name="user_id")

    class Meta:
        db_table = 'asv_user_permission_info'


class RolePermissInfo(models.Model):
    startDate = models.DateTimeField(db_column="state_date", null=True)
    endDate = models.DateTimeField(db_column="end_data", null=True)
    desc = models.CharField(db_column="desc", max_length=255)

    permisses = models.ForeignKey(Permission, related_name="permiss_id")
    roles = models.ForeignKey(Role, related_name="role_id")

    class Meta:
        db_table = 'asv_user_role_permiss_info'

class UserRoleInfo(models.Model):
    startDate = models.DateTimeField(db_column="state_date", null=True)
    endDate = models.DateTimeField(db_column="end_data", null=True)
    desc = models.CharField(db_column="desc", max_length=255)

    roles = models.ForeignKey(Permission, related_name="role_id")
    users = models.ForeignKey(Role, related_name="user_id")

    class Meta:
        db_table = 'asv_user_role_info'


