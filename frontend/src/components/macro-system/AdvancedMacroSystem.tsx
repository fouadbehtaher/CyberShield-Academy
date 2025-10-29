import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, TextInput, Select, Switch, Group, ActionIcon, JsonInput } from '@mantine/core';
import { IconPlayerPlay, IconTrash, IconEdit, IconCopy, IconClock, IconScript } from '@tabler/icons-react';

interface MacroCommand {
  id: string;
  type: 'control' | 'simulation' | 'ai' | 'user' | 'system';
  action: string;
  parameters: Record<string, any>;
  delay: number;
  condition?: {
    type: 'if' | 'while' | 'when';
    expression: string;
  };
}

interface Macro {
  id: string;
  name: string;
  description: string;
  category: string;
  commands: MacroCommand[];
  enabled: boolean;
  trigger: 'manual' | 'schedule' | 'event' | 'voice';
  schedule?: string;
  eventCondition?: string;
  createdAt: Date;
  lastExecuted?: Date;
  executionCount: number;
}

export const AdvancedMacroSystem: React.FC = () => {
  const [macros, setMacros] = useState<Macro[]>([]);
  const [editingMacro, setEditingMacro] = useState<Macro | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedActions, setRecordedActions] = useState<MacroCommand[]>([]);
  const [executionHistory, setExecutionHistory] = useState<Map<string, any[]>>(new Map());

  const MacroEditor: React.FC<{ macro: Macro }> = ({ macro }) => {
    const [form, setForm] = useState(macro);

    return (
      <div className="macro-editor">
        <div className="editor-header">
          <h3>✏️ محرر الماكرو: {macro.name}</h3>
        </div>

        <div className="editor-content">
          <Card className="basic-info">
            <h4>المعلومات الأساسية</h4>
            <TextInput
              label="اسم الماكرو"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <TextInput
              label="الوصف"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <Select
              label="الفئة"
              value={form.category}
              onChange={value => setForm({ ...form, category: value || '' })}
              data={[
                { value: 'automation', label: '🔄 الأتمتة' },
                { value: 'simulation', label: '🎮 المحاكاة' },
                { value: 'ai', label: '🤖 الذكاء الاصطناعي' },
                { value: 'maintenance', label: '🔧 الصيانة' },
                { value: 'emergency', label: '🚨 الطوارئ' }
              ]}
            />
          </Card>

          <Card className="commands-editor">
            <h4>🛠️ محرر الأوامر</h4>
            <div className="commands-list">
              {form.commands.map((command, index) => (
                <CommandEditor
                  key={command.id}
                  command={command}
                  index={index}
                  onChange={updatedCommand => {
                    const newCommands = [...form.commands];
                    newCommands[index] = updatedCommand;
                    setForm({ ...form, commands: newCommands });
                  }}
                  onRemove={() => {
                    const newCommands = form.commands.filter((_, i) => i !== index);
                    setForm({ ...form, commands: newCommands });
                  }}
                />
              ))}
            </div>

            <Button
              variant="light"
              onClick={() => {
                const newCommand: MacroCommand = {
                  id: Date.now().toString(),
                  type: 'control',
                  action: 'wait',
                  parameters: { duration: 1000 },
                  delay: 0
                };
                setForm({ ...form, commands: [...form.commands, newCommand] });
              }}
            >
              ➕ إضافة أمر جديد
            </Button>
          </Card>

          <Card className="conditions-editor">
            <h4>⚙️ محرر الشروط والمشغلات</h4>
            <Select
              label="نوع التشغيل"
              value={form.trigger}
              onChange={value => setForm({ ...form, trigger: value as any })}
              data={[
                { value: 'manual', label: '👆 يدوي' },
                { value: 'schedule', label: '⏰ مجدول' },
                { value: 'event', label: '🎯 حدث' },
                { value: 'voice', label: '🎤 صوتي' }
              ]}
            />

            {form.trigger === 'schedule' && (
              <TextInput
                label="جدولة (Cron Expression)"
                value={form.schedule}
                onChange={e => setForm({ ...form, schedule: e.target.value })}
                placeholder="0 9 * * 1-5"
              />
            )}

            {form.trigger === 'event' && (
              <JsonInput
                label="شرط الحدث"
                value={form.eventCondition}
                onChange={value => setForm({ ...form, eventCondition: value })}
                formatOnBlur
                autosize
              />
            )}
          </Card>

          <Group className="editor-actions">
            <Button variant="filled" color="green" leftSection={<IconPlayerPlay size={16} />}>
              ▶️ تشغيل الماكرو
            </Button>
            <Button variant="light" color="blue">
              💾 حفظ التغييرات
            </Button>
            <Button variant="outline" color="gray">
              ❌ إلغاء
            </Button>
          </Group>
        </div>
      </div>
    );
  };

  const CommandEditor: React.FC<{
    command: MacroCommand;
    index: number;
    onChange: (command: MacroCommand) => void;
    onRemove: () => void;
  }> = ({ command, index, onChange, onRemove }) => {
    return (
      <Card className="command-editor" withBorder>
        <div className="command-header">
          <span className="command-number">#{index + 1}</span>
          <Select
            value={command.type}
            onChange={value => onChange({ ...command, type: value as any })}
            data={[
              { value: 'control', label: '🎛️ تحكم' },
              { value: 'simulation', label: '🎮 محاكاة' },
              { value: 'ai', label: '🤖 ذكاء اصطناعي' },
              { value: 'user', label: '👤 مستخدم' },
              { value: 'system', label: '⚙️ نظام' }
            ]}
          />
          <ActionIcon color="red" onClick={onRemove}>
            <IconTrash size={16} />
          </ActionIcon>
        </div>

        <div className="command-body">
          <Select
            label="الإجراء"
            value={command.action}
            onChange={value => onChange({ ...command, action: value || '' })}
            data={getActionOptions(command.type)}
          />

          <JsonInput
            label="المعاملات"
            value={JSON.stringify(command.parameters, null, 2)}
            onChange={value => {
              try {
                const params = JSON.parse(value);
                onChange({ ...command, parameters: params });
              } catch (error) {
                // ignore parse errors while typing
              }
            }}
            autosize
            minRows={2}
          />

          <TextInput
            label="التأخير (مللي ثانية)"
            type="number"
            value={command.delay}
            onChange={e => onChange({ ...command, delay: parseInt(e.target.value, 10) || 0 })}
          />

          <div className="condition-editor">
            <Select
              label="شرط التنفيذ"
              value={command.condition?.type || 'none'}
              onChange={value => {
                if (value === 'none') {
                  onChange({ ...command, condition: undefined });
                } else {
                  onChange({
                    ...command,
                    condition: {
                      type: value as any,
                      expression: ''
                    }
                  });
                }
              }}
              data={[
                { value: 'none', label: 'بدون شرط' },
                { value: 'if', label: 'إذا (if)' },
                { value: 'while', label: 'طالما (while)' },
                { value: 'when', label: 'عندما (when)' }
              ]}
            />

            {command.condition && (
              <TextInput
                label="التعبير الشرطي"
                value={command.condition.expression}
                onChange={e =>
                  onChange({
                    ...command,
                    condition: {
                      ...command.condition!,
                      expression: e.target.value
                    }
                  })
                }
                placeholder="user.level > 5 && simulation.active"
              />
            )}
          </div>
        </div>
      </Card>
    );
  };

  const getActionOptions = (type: string) => {
    const actions: Record<string, Array<{ value: string; label: string }>> = {
      control: [
        { value: 'set_time_scale', label: 'تعيين سرعة الزمن' },
        { value: 'set_difficulty', label: 'تعيين مستوى الصعوبة' },
        { value: 'toggle_monitoring', label: 'تفعيل/تعطيل المراقبة' },
        { value: 'change_resource_allocation', label: 'تغيير توزيع الموارد' }
      ],
      simulation: [
        { value: 'start_simulation', label: 'بدء المحاكاة' },
        { value: 'stop_simulation', label: 'إيقاف المحاكاة' },
        { value: 'pause_simulation', label: 'إيقاف مؤقت' },
        { value: 'reset_simulation', label: 'إعادة تعيين' },
        { value: 'load_scenario', label: 'تحميل سيناريو' }
      ],
      ai: [
        { value: 'train_models', label: 'تدريب النماذج' },
        { value: 'update_recommendations', label: 'تحديث التوصيات' },
        { value: 'analyze_behavior', label: 'تحليل السلوك' },
        { value: 'generate_report', label: 'توليد تقرير' }
      ],
      user: [
        { value: 'send_notification', label: 'إرسال إشعار' },
        { value: 'update_user_role', label: 'تحديث صلاحية مستخدم' },
        { value: 'bulk_action', label: 'إجراء جماعي' },
        { value: 'create_user_group', label: 'إنشاء مجموعة مستخدمين' }
      ],
      system: [
        { value: 'backup_data', label: 'نسخ احتياطي' },
        { value: 'cleanup_cache', label: 'تنظيف الذاكرة المؤقتة' },
        { value: 'update_system', label: 'تحديث النظام' },
        { value: 'health_check', label: 'فحص صحة النظام' }
      ]
    };

    return actions[type] || [];
  };

  const MacroRecorder: React.FC = () => {
    const [recordingName, setRecordingName] = useState('');

    return (
      <Card className="macro-recorder">
        <h4>🔴 مسجل الماكرو</h4>

        <div className="recorder-controls">
          {!isRecording ? (
            <Button
              variant="filled"
              color="red"
              leftSection={<IconScript size={16} />}
              onClick={() => {
                setIsRecording(true);
                setRecordedActions([]);
              }}
            >
              بدء التسجيل
            </Button>
          ) : (
            <Group>
              <Button variant="light" color="green" onClick={() => setIsRecording(false)}>
                ⏹️ إيقاف التسجيل
              </Button>
              <TextInput
                placeholder="اسم الماكرو المسجل"
                value={recordingName}
                onChange={e => setRecordingName(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (recordingName && recordedActions.length > 0) {
                    const newMacro: Macro = {
                      id: Date.now().toString(),
                      name: recordingName,
                      description: `ماكرو مسجل تلقائياً - ${new Date().toLocaleString()}`,
                      category: 'automation',
                      commands: recordedActions,
                      enabled: true,
                      trigger: 'manual',
                      createdAt: new Date(),
                      executionCount: 0
                    };
                    setMacros([...macros, newMacro]);
                    setRecordingName('');
                    setRecordedActions([]);
                  }
                }}
              >
                💾 حفظ المسجل
              </Button>
            </Group>
          )}
        </div>

        {isRecording && (
          <div className="recording-info">
            <div className="recording-indicator">
              <span className="pulse">●</span> جاري التسجيل...
            </div>
            <div className="recorded-actions-count">عدد الإجراءات المسجلة: {recordedActions.length}</div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="advanced-macro-system">
      <div className="macro-system-header">
        <h2>🎛️ نظام الماكرو والأتمتة المتقدم</h2>
        <p>أنشئ وأدير سيناريوهات الأتمتة المعقدة بسهولة</p>
      </div>

      <div className="macro-system-layout">
        <div className="macro-sidebar">
          <MacroRecorder />

          <Card className="quick-macros">
            <h4>⚡ ماكروات سريعة</h4>
            <div className="quick-macro-list">
              <Button variant="light" fullWidth>
                🌅 بداية اليوم
              </Button>
              <Button variant="light" fullWidth>
                🌙 نهاية اليوم
              </Button>
              <Button variant="light" fullWidth>
                🚨 وضع الطوارئ
              </Button>
              <Button variant="light" fullWidth>
                🔄 صيانة النظام
              </Button>
            </div>
          </Card>

          <Card className="macro-categories">
            <h4>📁 التصنيفات</h4>
            <div className="category-list">
              {['الكل', 'الأتمتة', 'المحاكاة', 'الذكاء الاصطناعي', 'الصيانة', 'الطوارئ'].map(category => (
                <div key={category} className="category-item">
                  {category}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="macro-main-area">
          {editingMacro ? (
            <MacroEditor macro={editingMacro} />
          ) : (
            <>
              <Card className="macro-control-bar">
                <Group>
                  <Button variant="filled" color="blue">
                    ➕ إنشاء ماكرو جديد
                  </Button>
                  <Button variant="light">📥 استيراد ماكرو</Button>
                  <Button variant="light">📤 تصدير الكل</Button>
                </Group>
              </Card>

              <div className="macros-grid">
                {macros.map(macro => (
                  <Card key={macro.id} className="macro-card" withBorder>
                    <div className="macro-card-header">
                      <div className="macro-info">
                        <h4>{macro.name}</h4>
                        <p>{macro.description}</p>
                      </div>
                      <div className="macro-actions">
                        <ActionIcon color="green">
                          <IconPlayerPlay size={16} />
                        </ActionIcon>
                        <ActionIcon color="blue" onClick={() => setEditingMacro(macro)}>
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon color="orange">
                          <IconCopy size={16} />
                        </ActionIcon>
                        <ActionIcon color="red">
                          <IconTrash size={16} />
                        </ActionIcon>
                      </div>
                    </div>

                    <div className="macro-stats">
                      <div className="stat">
                        <IconClock size={14} />
                        <span>{macro.commands.length} أمر</span>
                      </div>
                      <div className="stat">
                        <IconPlayerPlay size={14} />
                        <span>{macro.executionCount} تشغيل</span>
                      </div>
                    </div>

                    <div className="macro-trigger">
                      <Switch
                        label="مفعل"
                        checked={macro.enabled}
                        onChange={() => {
                          setMacros(
                            macros.map(item =>
                              item.id === macro.id ? { ...item, enabled: !item.enabled } : item
                            )
                          );
                        }}
                      />
                      <span className="trigger-type">{getTriggerLabel(macro.trigger)}</span>
                    </div>

                    {macro.lastExecuted && (
                      <div className="macro-last-run">
                        آخر تشغيل: {macro.lastExecuted.toLocaleString()}
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {macros.length === 0 && (
                <Card className="empty-state">
                  <div className="empty-content">
                    <IconScript size={48} color="#ccc" />
                    <h3>لا توجد ماكروات</h3>
                    <p>ابدأ بإنشاء أول ماكرو خاص بك أو استخدم المسجل</p>
                    <Button variant="light">➕ إنشاء أول ماكرو</Button>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const getTriggerLabel = (trigger: string) => {
  const labels: Record<string, string> = {
    manual: '👆 يدوي',
    schedule: '⏰ مجدول',
    event: '🎯 حدث',
    voice: '🎤 صوتي'
  };
  return labels[trigger] || trigger;
};
