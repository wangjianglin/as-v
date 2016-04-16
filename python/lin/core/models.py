from django.core.paginator import Paginator


class ItemsFiled(object):
    def __init__(self,instance,attr,*order_by):
        self._attr = attr;
        self._order_by = order_by;
        self._instance = instance;
        self.__cache_value = None;

    def __call__(self, *args, **kwargs):
        items_value = getattr(self._instance,self._attr);
        if items_value is None:
            return ;
        if self.__cache_value is not None:
            return self.__cache_value;
        if self._order_by is None:
            return items_value.all();
        self.__cache_value = items_value.all().order_by(*self._order_by);
        return self.__cache_value;

    def __len__(self):
        return len(self.__call__());


################################################################################################
#
# 1支持多字段排序
#
################################################################################################
class Items(object):

    # def _cls;
    # def _orderBy;
    def __init__(self,attr,*order_by):
        self._attr = attr;
        self._order_by = order_by;

    def contribute_to_class(self, cls, name, virtual_only=False):
        #cls._meta.__dict__['items'] = self;
        d = cls._meta.__dict__.get('_model_own_fields')
        #d = cls._meta.__dict__['modelOwnFields']
        if d is None:
            d = {};
            cls._meta.__dict__['_model_own_fields'] = d;
        d[name] = self;

        setattr(cls, name, self)

        # pass
    #     # self.set_attributes_from_name(name)
    #     # self.model = cls
    #     if virtual_only:
    #         cls._meta.add_field(self, virtual=True)
    #     else:
    #         cls._meta.add_field(self)
    #     # if self.choices:
    #     #     setattr(cls, 'get_%s_display' % self.name,
    #                 curry(cls._get_FIELD_display, field=self))
    # # def __getattr__(self, item):
    # #     return 5;

    # def __get__(self, instance, owner):
    #     return 5;
    def create_field(self,instance):
        if hasattr(self,'_order_by'):
            return ItemsFiled(instance,self._attr,*self._order_by);
        return ItemsFiled(instance,self._attr,None);


class ItemsBase(type):
    """
    Metaclass for all models.
    """
    def __new__(cls, name, bases, attrs):
        return super(ItemsBase, cls).__new__

        # Also ensure initialization is only performed for subclasses of Model
        # (excluding Model class itself).
        # parents = [b for b in bases if isinstance(b, ModelBase)]
        # if not parents:
        #     return super_new(cls, name, bases, attrs)
        #
        # # Create the class.
        # module = attrs.pop('__module__')
        # new_class = super_new(cls, name, bases, {'__module__': module})
        # attr_meta = attrs.pop('Meta', None)
        # abstract = getattr(attr_meta, 'abstract', False)
        # if not attr_meta:
        #     meta = getattr(new_class, 'Meta', None)
        # else:
        #     meta = attr_meta
        # base_meta = getattr(new_class, '_meta', None)
        #
        # # Look for an application configuration to attach the model to.
        # app_config = apps.get_containing_app_config(module)
        #
        # if getattr(meta, 'app_label', None) is None:
        #
        #     if app_config is None:
        #         # If the model is imported before the configuration for its
        #         # application is created (#21719), or isn't in an installed
        #         # application (#21680), use the legacy logic to figure out the
        #         # app_label by looking one level up from the package or module
        #         # named 'models'. If no such package or module exists, fall
        #         # back to looking one level up from the module this model is
        #         # defined in.
        #
        #         # For 'django.contrib.sites.models', this would be 'sites'.
        #         # For 'geo.models.places' this would be 'geo'.
        #
        #         msg = (
        #             "Model class %s.%s doesn't declare an explicit app_label "
        #             "and either isn't in an application in INSTALLED_APPS or "
        #             "else was imported before its application was loaded. "
        #             "This will no longer be supported in Django 1.9." %
        #             (module, name))
        #         if not abstract:
        #             warnings.warn(msg, RemovedInDjango19Warning, stacklevel=2)
        #
        #         model_module = sys.modules[new_class.__module__]
        #         package_components = model_module.__name__.split('.')
        #         package_components.reverse()  # find the last occurrence of 'models'
        #         try:
        #             app_label_index = package_components.index(MODELS_MODULE_NAME) + 1
        #         except ValueError:
        #             app_label_index = 1
        #         try:
        #             kwargs = {"app_label": package_components[app_label_index]}
        #         except IndexError:
        #             raise ImproperlyConfigured(
        #                 'Unable to detect the app label for model "%s." '
        #                 'Ensure that its module, "%s", is located inside an installed '
        #                 'app.' % (new_class.__name__, model_module.__name__)
        #             )
        #     else:
        #         kwargs = {"app_label": app_config.label}
        #
        # else:
        #     kwargs = {}
        #
        # new_class.add_to_class('_meta', Options(meta, **kwargs))
        # if not abstract:
        #     new_class.add_to_class(
        #         'DoesNotExist',
        #         subclass_exception(
        #             str('DoesNotExist'),
        #             tuple(
        #                 x.DoesNotExist for x in parents if hasattr(x, '_meta') and not x._meta.abstract
        #             ) or (ObjectDoesNotExist,),
        #             module,
        #             attached_to=new_class))
        #     new_class.add_to_class(
        #         'MultipleObjectsReturned',
        #         subclass_exception(
        #             str('MultipleObjectsReturned'),
        #             tuple(
        #                 x.MultipleObjectsReturned for x in parents if hasattr(x, '_meta') and not x._meta.abstract
        #             ) or (MultipleObjectsReturned,),
        #             module,
        #             attached_to=new_class))
        #     if base_meta and not base_meta.abstract:
        #         # Non-abstract child classes inherit some attributes from their
        #         # non-abstract parent (unless an ABC comes before it in the
        #         # method resolution order).
        #         if not hasattr(meta, 'ordering'):
        #             new_class._meta.ordering = base_meta.ordering
        #         if not hasattr(meta, 'get_latest_by'):
        #             new_class._meta.get_latest_by = base_meta.get_latest_by
        #
        # is_proxy = new_class._meta.proxy
        #
        # # If the model is a proxy, ensure that the base class
        # # hasn't been swapped out.
        # if is_proxy and base_meta and base_meta.swapped:
        #     raise TypeError("%s cannot proxy the swapped model '%s'." % (name, base_meta.swapped))
        #
        # if getattr(new_class, '_default_manager', None):
        #     if not is_proxy:
        #         # Multi-table inheritance doesn't inherit default manager from
        #         # parents.
        #         new_class._default_manager = None
        #         new_class._base_manager = None
        #     else:
        #         # Proxy classes do inherit parent's default manager, if none is
        #         # set explicitly.
        #         new_class._default_manager = new_class._default_manager._copy_to_model(new_class)
        #         new_class._base_manager = new_class._base_manager._copy_to_model(new_class)
        #
        # # Add all attributes to the class.
        # for obj_name, obj in attrs.items():
        #     new_class.add_to_class(obj_name, obj)
        #
        # # All the fields of any type declared on this model
        # new_fields = chain(
        #     new_class._meta.local_fields,
        #     new_class._meta.local_many_to_many,
        #     new_class._meta.virtual_fields
        # )
        # field_names = {f.name for f in new_fields}
        #
        # # Basic setup for proxy models.
        # if is_proxy:
        #     base = None
        #     for parent in [kls for kls in parents if hasattr(kls, '_meta')]:
        #         if parent._meta.abstract:
        #             if parent._meta.fields:
        #                 raise TypeError(
        #                     "Abstract base class containing model fields not "
        #                     "permitted for proxy model '%s'." % name
        #                 )
        #             else:
        #                 continue
        #         if base is not None:
        #             raise TypeError("Proxy model '%s' has more than one non-abstract model base class." % name)
        #         else:
        #             base = parent
        #     if base is None:
        #         raise TypeError("Proxy model '%s' has no non-abstract model base class." % name)
        #     new_class._meta.setup_proxy(base)
        #     new_class._meta.concrete_model = base._meta.concrete_model
        #     base._meta.concrete_model._meta.proxied_children.append(new_class._meta)
        # else:
        #     new_class._meta.concrete_model = new_class
        #
        # # Collect the parent links for multi-table inheritance.
        # parent_links = {}
        # for base in reversed([new_class] + parents):
        #     # Conceptually equivalent to `if base is Model`.
        #     if not hasattr(base, '_meta'):
        #         continue
        #     # Skip concrete parent classes.
        #     if base != new_class and not base._meta.abstract:
        #         continue
        #     # Locate OneToOneField instances.
        #     for field in base._meta.local_fields:
        #         if isinstance(field, OneToOneField):
        #             parent_links[field.rel.to] = field
        #
        # # Do the appropriate setup for any model parents.
        # for base in parents:
        #     original_base = base
        #     if not hasattr(base, '_meta'):
        #         # Things without _meta aren't functional models, so they're
        #         # uninteresting parents.
        #         continue
        #
        #     parent_fields = base._meta.local_fields + base._meta.local_many_to_many
        #     # Check for clashes between locally declared fields and those
        #     # on the base classes (we cannot handle shadowed fields at the
        #     # moment).
        #     for field in parent_fields:
        #         if field.name in field_names:
        #             raise FieldError(
        #                 'Local field %r in class %r clashes '
        #                 'with field of similar name from '
        #                 'base class %r' % (field.name, name, base.__name__)
        #             )
        #     if not base._meta.abstract:
        #         # Concrete classes...
        #         base = base._meta.concrete_model
        #         if base in parent_links:
        #             field = parent_links[base]
        #         elif not is_proxy:
        #             attr_name = '%s_ptr' % base._meta.model_name
        #             field = OneToOneField(base, name=attr_name,
        #                     auto_created=True, parent_link=True)
        #             # Only add the ptr field if it's not already present;
        #             # e.g. migrations will already have it specified
        #             if not hasattr(new_class, attr_name):
        #                 new_class.add_to_class(attr_name, field)
        #         else:
        #             field = None
        #         new_class._meta.parents[base] = field
        #     else:
        #         # .. and abstract ones.
        #         for field in parent_fields:
        #             new_field = copy.deepcopy(field)
        #             new_class.add_to_class(field.name, new_field)
        #
        #         # Pass any non-abstract parent classes onto child.
        #         new_class._meta.parents.update(base._meta.parents)
        #
        #     # Inherit managers from the abstract base classes.
        #     new_class.copy_managers(base._meta.abstract_managers)
        #
        #     # Proxy models inherit the non-abstract managers from their base,
        #     # unless they have redefined any of them.
        #     if is_proxy:
        #         new_class.copy_managers(original_base._meta.concrete_managers)
        #
        #     # Inherit virtual fields (like GenericForeignKey) from the parent
        #     # class
        #     for field in base._meta.virtual_fields:
        #         if base._meta.abstract and field.name in field_names:
        #             raise FieldError(
        #                 'Local field %r in class %r clashes '
        #                 'with field of similar name from '
        #                 'abstract base class %r' % (field.name, name, base.__name__)
        #             )
        #         new_class.add_to_class(field.name, copy.deepcopy(field))
        #
        # if abstract:
        #     # Abstract base models can't be instantiated and don't appear in
        #     # the list of models for an app. We do the final setup for them a
        #     # little differently from normal models.
        #     attr_meta.abstract = False
        #     new_class.Meta = attr_meta
        #     return new_class
        #
        # new_class._prepare()
        # new_class._meta.apps.register_model(new_class._meta.app_label, new_class)
        # return new_class

    def copy_managers(cls, base_managers):
        # This is in-place sorting of an Options attribute, but that's fine.
        base_managers.sort()
        # for _, mgr_name, manager in base_managers:  # NOQA (redefinition of _)
        #     val = getattr(cls, mgr_name, None)
        #     if not val or val is manager:
        #         new_manager = manager._copy_to_model(cls)
        #         cls.add_to_class(mgr_name, new_manager)

    def add_to_class(cls, name, value):
        pass
        # # We should call the contribute_to_class method only if it's bound
        # if not inspect.isclass(value) and hasattr(value, 'contribute_to_class'):
        #     value.contribute_to_class(cls, name)
        # else:
        #     setattr(cls, name, value)

    def _prepare(cls):
        pass

def with_metaclass(meta, *bases):
    """Create a base class with a metaclass."""
    # This requires a bit of explanation: the basic idea is to make a dummy
    # metaclass for one level of class instantiation that replaces itself with
    # the actual metaclass.
    class metaclass(meta):
        def __new__(cls, name, this_bases, d):
            return meta(name, bases, d)
    return type.__new__(metaclass, 'temporary_class', (), {})

class A(with_metaclass(ItemsBase)):
    pass

class Model():
    # pass
    def __init__(self, *args, **kwargs):
        modelOwnFields = self._meta.__dict__.get('_model_own_fields');
        if not modelOwnFields is None:
            for name,field in modelOwnFields.items():
                self.__dict__[name] = field.create_field(self);
        #         setattr(self, name, field)


class Page():
    def __init__(self,query,page_no,page_size):

        self._page_no = page_no;
        self._page_size = page_size;

        self._paginator = Paginator(query,page_size);
    # paginator.page(1);
        self._p = self._paginator.page(page_no+1);

    @property
    def pageNo(self):
        return self._p.number-1;

    @property
    def pageSize(self):
        return self._page_size;

    @property
    def list(self):
        return self._p.object_list;

    @property
    def count(self):
        return self._paginator.count;


    @property
    def pages(self):
        if self._paginator.count == 0:
            return 0;
        return self._paginator.num_pages;