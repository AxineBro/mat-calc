package github.axine.matrixcalculator.domain.operation.info;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

final class InfoMessages {

    private final MessageSource source;

    InfoMessages(MessageSource source) {
        this.source = source;
    }

    String t(String key, Object... args) {
        return source.getMessage(key, args, LocaleContextHolder.getLocale());
    }
}