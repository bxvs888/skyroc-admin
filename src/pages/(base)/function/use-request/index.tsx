import type { DescriptionsProps } from 'antd';

import { useUserList } from '@/service/hooks';

const { Title } = ATypography;

type Item<T> = T extends any[] ? T[number] : T;

type ValuesOf<T> = T[keyof T];

type Values = ValuesOf<Api.SystemManage.User>;

function transformDataToItem<T extends string, U extends Values>(
  tuple: [T, U]
): NonNullable<Item<DescriptionsProps['items']>> {
  return {
    children: tuple[1],
    key: tuple[0],
    label: tuple[0]
  };
}

const Component = () => {
  const [current, setCurrent] = useState(1);

  const { data, isLoading } = useUserList({
    current,
    size: 10
  });

  const items = data ? Object.entries(data.records[0]).map(transformDataToItem) : [];

  function handleChange() {
    setCurrent(current + 1);
  }

  return (
    <ACard
      className="h-full card-wrapper"
      size="small"
      variant="borderless"
    >
      <Title
        className="mb-8 text-center"
        level={2}
      >
        useRequest 示例
      </Title>

      <div className="flex flex-col items-center gap-6">
        <AButton
          className="transition-transform hover:scale-105"
          loading={isLoading}
          type="primary"
          onClick={handleChange}
        >
          下一页数据
        </AButton>

        <div className="mx-auto max-w-2xl rounded-lg p-4 shadow-sm backdrop-blur-sm">
          <p className="text-center leading-relaxed">
            使用 React Query 的 useUserList hook 来获取用户列表数据，当参数变化时会自动刷新请求。
          </p>
        </div>

        <div className="mt-4 w-full">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <ASpin size="large" />
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <ADescriptions
              bordered
              className="overflow-hidden rounded-lg shadow-sm backdrop-blur-sm"
              column={2}
              items={items}
              size="small"
            />
          )}

          {!isLoading && items.length === 0 && <AEmpty />}
        </div>
      </div>
    </ACard>
  );
};

export default Component;
