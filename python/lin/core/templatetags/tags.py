
from django import template
import re
from django.template import base
import traceback;

register = template.Library()

set_regex = re.compile(r'^\s*set\s+(\w+)\s*=\s*(.*)$')

# @register.tag('set')
@register.tag('set')
def do_set(parser, token):
    m = re.match(set_regex, token.contents)
    if m:
        name, exp = m.group(1), m.group(2)
        return SetNode(name, exp)
    else:
        raise template.TemplateSyntaxError('{% set varname = python_expression %}')

class SetNode(template.Node):
    def __init__(self, varname, expression):
        self.varname = varname
        self.expression = expression

    def render(self, context):
        # if self.expression is None:
        #     return '';
        # ns = self.expression.split('.');
        # pre_obj = context;
        # for item in ns:
        #     try:
        #         pre_obj = eval(item, {}, pre_obj);
        #     except BaseException as ex:
        #         return ''
        #     # if hasattr(pre_obj,item):
        #     #     pre_obj = pre_obj[item];
        #     # else:
        #     #     return '';
        try:
            context[self.varname] = eval(self.expression, {}, context)
        except BaseException as ex:
            exstr = traceback.format_exc();
            print(exstr)

        # context[self.varname] = pre_obj;
        return '';

# register.tag('set', do_set)



print_regex = re.compile(r'^\s*print\s+(.*)$')

@register.tag('print')
def do_print(parser, token):
    m = re.match(print_regex, token.contents)
    if m:
        exp = m.group(1)
        return PrintNode(exp)
    else:
        raise template.TemplateSyntaxError('{% print expression %}')

class PrintNode(template.Node):
    def __init__(self, expression):
        self.expression = expression

    def render(self, context):
        obj = eval(self.expression, {}, context)
        return str(obj)

#register.tag('print', do_print)


import_regex = re.compile(r'^\s*import\s+(\S+)(?:\s+as\s+(\w+))?$')
@register.tag('import')
def do_import(parser, token):
    m = re.match(import_regex, token.contents)
    if m:
        exp = m.group(1)
        try:
            alias = m.group(2)
        except:
            alias = None
        return ImportNode(exp, alias)
    else:
        raise template.TemplateSyntaxError('{% import import_expression [ as alias_name ] %}')

class ImportNode(template.Node):
    def __init__(self, expression, alias=None):
        if not alias: alias = expression
        self.expression = expression
        self.alias = alias

    def render(self, context):
        module = __import__(self.expression, {}, context)
        context[self.alias] = module
        return ''

# register.tag('import', do_import)


@register.filter(name='js')
def do_print(value, arg=None):

    value = value.replace("'","\\\'");
    value = value.replace("script","scr\'+\'ipt");
    value = value.replace("\n","\\n");
    # value = value.replace("<","&lt;");
    # value = value.replace(">","&gt;");

    return "'" + value + "'";

# base.add_to_builtins('lin.core.tags')
